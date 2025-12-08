package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.service.OrderService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {
    private final OrderService orderService;

    @PostMapping("/create-payment-intent")
    @PreAuthorize("isAuthenticated()")
    public Map<String, String> createPaymentIntent(Authentication auth) throws StripeException {
        String clientSecret = orderService.createPaymentIntent(auth.getName());
        return Map.of("clientSecret", clientSecret);
    }
}
