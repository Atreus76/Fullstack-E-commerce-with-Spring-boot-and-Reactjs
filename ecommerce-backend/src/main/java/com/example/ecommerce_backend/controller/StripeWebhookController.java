package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.repository.OrderRepository;
import com.example.ecommerce_backend.service.CartService;
import com.example.ecommerce_backend.service.OrderService;
import com.example.ecommerce_backend.status.OrderStatus;
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
    private final OrderRepository orderRepository;
    private final CartService cartService;
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
            // Find the order by stripePaymentIntentId
            Order order = orderRepository.findByStripePaymentIntentId(intent.getId())
                    .orElseThrow();

            // Update order status
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            // Clear the user's cart after successful payment
            String userEmail = order.getUser().getEmail(); // or however you get the user
            cartService.clearCart(userEmail); // implement this method
        }

        return ResponseEntity.ok().build();
    }
}
