package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.model.Cart;
import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.model.OrderItem;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
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

    @Value("${stripe.secret-key}")
    private String stripeKey;

    public String createPaymentIntent(String email) throws StripeException {
        Cart cart = cartService.getCartForUser(email);
        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart is empty");

        Stripe.apiKey = stripeKey;

        BigDecimal amount = cartService.toResponse(cart).getTotal()
                .multiply(BigDecimal.valueOf(100)); // Stripe uses cents

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.longValue())
                .setCurrency("usd")
                .putMetadata("userEmail", email)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Create draft order
        Order order = Order.builder()
                .user(cart.getUser())
                .stripePaymentIntentId(paymentIntent.getId())
                .createdAt(LocalDateTime.now())
                .totalAmount(cartService.toResponse(cart).getTotal())
                .status(OrderStatus.PENDING)
                .build();

        cart.getItems().forEach(cartItem -> {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(cartItem.getProduct().getId());
            oi.setProductName(cartItem.getProduct().getName());
            oi.setProductImage(cartItem.getProduct().getImages().get(0));
            oi.setPriceAtPurchase(cartItem.getProduct().getPrice());
            oi.setQuantity(cartItem.getQuantity());
            order.getItems().add(oi);
        });

        orderRepository.save(order);
        return paymentIntent.getClientSecret(); // ← send this to frontend
    }

    // Called by webhook after payment success
    public void fulfillOrder(String paymentIntentId) {
        System.out.println("Fulfilling order for PI: " + paymentIntentId);
        Order order = orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseGet(() -> {
                    System.out.println("⚠️ No order found for ID: " + paymentIntentId);
                    return null;
                });

        if (order != null) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
            System.out.println("✅ Order status updated to PAID in database!");
        }
    }
}
