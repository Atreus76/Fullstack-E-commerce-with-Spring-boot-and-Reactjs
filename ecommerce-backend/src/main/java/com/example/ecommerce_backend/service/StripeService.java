package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripeService {
    private final OrderRepository orderRepository;

    @Value("${stripe.secret-key}")
    private String stripeKey;
    public String createPaymentIntentForOrder(Order order) throws StripeException {

        Stripe.apiKey = stripeKey;
        // Check if order already has a paymentIntentId
        if (order.getStripePaymentIntentId() != null) {
            // Retrieve existing and return client secret (or update amount if needed)
            PaymentIntent intent = PaymentIntent.retrieve(order.getStripePaymentIntentId());
            return intent.getClientSecret();
        }
        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

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
