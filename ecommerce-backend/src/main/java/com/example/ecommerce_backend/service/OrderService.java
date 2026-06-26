package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.model.*;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.status.OrderStatus;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${stripe.secret-key}")
    private String stripeKey;

    public String createPaymentIntent(String email) throws StripeException {
        Cart cart = cartService.getCartForUser(email);
        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart is empty");

        BigDecimal total = calculateCartTotal(cart);
        Order order = buildPendingOrderFromCart(cart, total);
        reserveStockForOrder(order);

        Stripe.apiKey = stripeKey;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(total.multiply(BigDecimal.valueOf(100)).longValue())
                .setCurrency("usd")
                .putMetadata("userEmail", email)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        order.setStripePaymentIntentId(paymentIntent.getId());
        orderRepository.save(order);
        cartService.clearCart(email);

        return paymentIntent.getClientSecret();
    }

    public void reserveStockForOrder(Order order) {
        if (order.isStockReserved()) return;

        order.getItems().forEach(item -> {
            Product product = productRepository.findByIdForUpdate(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            validateStock(product, item.getQuantity());
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        });

        order.setStockReserved(true);
        orderRepository.save(order);
    }

    public void releaseReservedStock(Order order) {
        if (!order.isStockReserved()) return;

        order.getItems().forEach(item -> {
            Product product = productRepository.findByIdForUpdate(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            int currentStock = product.getStock() != null ? product.getStock() : 0;
            product.setStock(currentStock + item.getQuantity());
            productRepository.save(product);
        });

        order.setStockReserved(false);
        orderRepository.save(order);
    }

    // Called by webhook after payment success
    public void fulfillOrder(String paymentIntentId) {
        System.out.println("Fulfilling order for PI: " + paymentIntentId);
        Order order = orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseGet(() -> {
                    System.out.println("No order found for ID: " + paymentIntentId);
                    return null;
                });

        if (order == null) return;
        if (order.getStatus() == OrderStatus.PAID) {
            System.out.println("Order already marked as PAID, skipping duplicate webhook.");
            return;
        }

        reserveStockForOrder(order);
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
        cartService.clearCart(order.getUser().getEmail());
        System.out.println("Order status updated to PAID in database.");
    }

    public Order findByIdAndUser(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByIdAndUser(orderId, user)
                .orElse(null);
    }

    private Order buildPendingOrderFromCart(Cart cart, BigDecimal total) {
        Order order = Order.builder()
                .user(cart.getUser())
                .createdAt(LocalDateTime.now())
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .build();

        cart.getItems().forEach(cartItem -> {
            Product product = cartItem.getProduct();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(firstImage(product));
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getItems().add(orderItem);
        });

        return order;
    }

    private BigDecimal calculateCartTotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void validateStock(Product product, int requestedQuantity) {
        if (requestedQuantity <= 0) throw new RuntimeException("Quantity must be greater than zero");
        if (!product.isActive()) throw new RuntimeException("Product is not available: " + product.getName());

        int availableStock = product.getStock() != null ? product.getStock() : 0;
        if (requestedQuantity > availableStock) {
            throw new RuntimeException("Insufficient stock for " + product.getName());
        }
    }

    private String firstImage(Product product) {
        return product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0)
                : null;
    }
}
