package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.ProductResponse;
import com.example.ecommerce_backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    public List<ProductResponse> getWishlist(Authentication auth) {
        return wishlistService.getWishlist(auth.getName());
    }

    @GetMapping("/ids")
    public List<Long> getWishlistProductIds(Authentication auth) {
        return wishlistService.getWishlistProductIds(auth.getName());
    }

    @PostMapping("/{productId}")
    public ProductResponse add(@PathVariable Long productId, Authentication auth) {
        return wishlistService.add(auth.getName(), productId);
    }

    @DeleteMapping("/{productId}")
    public void remove(@PathVariable Long productId, Authentication auth) {
        wishlistService.remove(auth.getName(), productId);
    }
}
