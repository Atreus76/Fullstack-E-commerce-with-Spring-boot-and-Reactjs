package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.CartResponse;
import com.example.ecommerce_backend.model.Cart;
import com.example.ecommerce_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public CartResponse add(@RequestBody Map<String, Object> body, Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = body.containsKey("quantity") ? (int) body.get("quantity") : 1;
        Cart cart = cartService.addToCart(auth.getName(), productId, quantity);
        return cartService.toResponse(cart);
    }

    @GetMapping
    public CartResponse getCart(Authentication auth) {
        Cart cart = cartService.getCartForUser(auth.getName());
        return cartService.toResponse(cart);
    }

    @PutMapping("/update")
    public CartResponse update(@RequestBody Map<String, Object> body, Authentication auth) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = (int) body.get("quantity");
        Cart cart = cartService.updateQuantity(auth.getName(), productId, quantity);
        return cartService.toResponse(cart);
    }

    @DeleteMapping("/remove/{productId}")
    public CartResponse remove(@PathVariable Long productId, Authentication auth) {
        cartService.removeItem(auth.getName(), productId);
        Cart cart = cartService.getCartForUser(auth.getName());
        return cartService.toResponse(cart);
    }

    @DeleteMapping("/clear")
    public String clear(Authentication auth) {
        cartService.clearCart(auth.getName());
        return "Cart cleared";
    }
}
