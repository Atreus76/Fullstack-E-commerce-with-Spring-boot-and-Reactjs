package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.OrderItemResponse;
import com.example.ecommerce_backend.DTO.OrderResponse;
import com.example.ecommerce_backend.DTO.PaymentResponse;
import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.model.User;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.service.OrderService;
import com.example.ecommerce_backend.service.StripeService;
import com.example.ecommerce_backend.status.OrderStatus;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StripeService stripeService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    // 1. CREATE ORDER + PAYMENT INTENT (called before showing Stripe form)
    @PostMapping("/create-from-cart")
    public OrderResponse createOrderFromCart(Authentication auth) throws StripeException {
        OrderService.OrderCheckoutResult checkout = orderService.createOrderFromCart(auth.getName());
        return toFullResponse(checkout.getOrder(), checkout.getClientSecret());
    }

    // 2. USER: My order history
    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(o -> toFullResponse(o, null))
                .toList();
    }

    @GetMapping("/my/{orderId}")
    public OrderResponse getMyOrdersById(@PathVariable Long orderId, Authentication auth){
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only view your own orders");
        }
        return toFullResponse(order, null);

    }

    // 3. ADMIN: All orders
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(o -> toFullResponse(o, null))
                .toList();
    }


    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestBody java.util.Map<String, String> body) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus nextStatus = OrderStatus.valueOf(body.getOrDefault("status", "").toUpperCase());
        if (nextStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Use the cancel endpoint to cancel and restore/refund an order");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cancelled orders cannot be updated");
        }

        order.setStatus(nextStatus);
        orderRepository.save(order);
        return toFullResponse(order, null);
    }
    // 4. USER: Cancel own PENDING order
    @DeleteMapping("/my/{orderId}")
    public ResponseEntity<String> cancelMyOrder(@PathVariable Long orderId, Authentication auth) throws ChangeSetPersister.NotFoundException {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only cancel your own orders");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            return ResponseEntity.badRequest()
                    .body("Only PENDING orders can be cancelled by customer");
        }

        cancelOrderAndRestoreStock(order);
        return ResponseEntity.ok("Order cancelled successfully");
    }

    // 5. ADMIN: Cancel any order (with refund if already paid)
    @DeleteMapping("/admin/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> adminCancelOrder(@PathVariable Long orderId) throws ChangeSetPersister.NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        boolean shouldRefund = order.getStripePaymentIntentId() != null && order.getStatus() != OrderStatus.PENDING;

        // If already paid, issue refund via Stripe
        if (shouldRefund) {
            try {
                Stripe.apiKey = stripeSecretKey;
                PaymentIntent pi = PaymentIntent.retrieve(order.getStripePaymentIntentId());

                RefundCreateParams params = RefundCreateParams.builder()
                        .setPaymentIntent(pi.getId())
                        .build();
                Refund.create(params);
            } catch (StripeException e) {
                return ResponseEntity.status(500)
                        .body("Order cancelled but refund failed: " + e.getMessage());
            }
        }

        cancelOrderAndRestoreStock(order);
        return ResponseEntity.ok(
                shouldRefund
                        ? "Order cancelled and full refund issued"
                        : "Order cancelled successfully"
        );
    }

    // Helper: cancel + restore stock
    private void cancelOrderAndRestoreStock(Order order) {
        orderService.releaseReservedStock(order);
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @PostMapping("/{orderId}/resume-payment")
    public ResponseEntity<?> resumePayment(
            @PathVariable Long orderId,
            Authentication authentication) throws StripeException {

        String email = authentication.getName(); // or however you get current user

        Order order = orderService.findByIdAndUser(orderId, email);

        if (order == null || !order.getStatus().equals(OrderStatus.PENDING)) {
            return ResponseEntity.badRequest().body("Order not found or cannot be resumed");
        }

        // Create or retrieve PaymentIntent (reuse if possible)
        String clientSecret = stripeService.createPaymentIntentForOrder(order);

        return ResponseEntity.ok(new PaymentResponse(clientSecret));
    }

    // Helper: convert Order to response DTO
    private OrderResponse toFullResponse(Order order, String clientSecret) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> new OrderItemResponse(
                        oi.getProductId(),
                        oi.getProductName(),
                        oi.getProductImage(),
                        oi.getPriceAtPurchase(),
                        oi.getQuantity()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStripePaymentIntentId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items,
                clientSecret
        );
    }
}
