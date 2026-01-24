package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.service.CartService;
import com.example.ecommerce_backend.service.OrderService;
import com.example.ecommerce_backend.status.OrderStatus;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.websocket.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final CartService cartService;
    @Value("${stripe.webhook-secret}") private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handle(@RequestBody String payload,
                                         @RequestHeader("Stripe-Signature") String sigHeader) {
        System.out.println("--- Webhook Hit ---");
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            System.out.println("Event Type: " + event.getType());

            if ("payment_intent.succeeded".equals(event.getType())) {
                EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

                // 1. deserializeUnsafe() bypasses the version check that is causing your error
                PaymentIntent intent = (PaymentIntent) dataObjectDeserializer.deserializeUnsafe();

                if (intent != null) {
                    System.out.println("✅ PaymentIntent parsed successfully (Unsafe Mode): " + intent.getId());
                    orderService.fulfillOrder(intent.getId());
                } else {
                    System.err.println("❌ Failed to parse PaymentIntent even with unsafe deserialization.");
                }
            }
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            // THIS WILL FORCE THE LOG TO APPEAR
            System.err.println("CRITICAL WEBHOOK ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
