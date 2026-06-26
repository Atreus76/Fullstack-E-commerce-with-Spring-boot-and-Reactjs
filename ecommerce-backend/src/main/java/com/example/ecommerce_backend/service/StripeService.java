package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.repository.OrderRepository;
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

@Service
@RequiredArgsConstructor
@Transactional
public class StripeService {
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Value("${stripe.secret-key}")
    private String stripeKey;
    public String createPaymentIntentForOrder(Order order) throws StripeException {

        Stripe.apiKey = stripeKey;
        // Check if order already has a paymentIntentId
        if (order.getStripePaymentIntentId() != null) {
            PaymentIntent intent = PaymentIntent.retrieve(order.getStripePaymentIntentId());

            if ("succeeded".equals(intent.getStatus())) {
                orderService.reserveStockForOrder(order);
                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);

                throw new RuntimeException("This order has already been paid.");
            }

            if ("canceled".equals(intent.getStatus())) {
                order.setStripePaymentIntentId(null);
                orderRepository.save(order);
            } else {
                orderService.reserveStockForOrder(order);
                return intent.getClientSecret();
            }
        }
        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        orderService.reserveStockForOrder(order);

        // Create new PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .putMetadata("orderId", order.getId().toString())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        // Save paymentIntentId to order for future resume
        order.setStripePaymentIntentId(intent.getId());
        orderRepository.save(order);

        return intent.getClientSecret();
    }


}
