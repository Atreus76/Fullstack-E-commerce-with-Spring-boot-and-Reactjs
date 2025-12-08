package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.service.OrderService;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {
    private final OrderService orderService;
    @Value("${stripe.webhook-secret}") private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handle(@RequestBody String payload,
                                         @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (Exception e) { return ResponseEntity.badRequest().body("Invalid signature"); }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
            orderService.fulfillOrder(intent.getId());
        }

        return ResponseEntity.ok().build();
    }
}
