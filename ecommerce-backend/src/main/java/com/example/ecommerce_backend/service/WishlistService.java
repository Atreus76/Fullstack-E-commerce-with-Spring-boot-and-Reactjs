package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.DTO.ProductResponse;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.model.User;
import com.example.ecommerce_backend.model.WishlistItem;
import com.example.ecommerce_backend.repository.ProductRepository;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.repository.WishlistItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {
    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<ProductResponse> getWishlist(String email) {
        User user = getUser(email);
        return wishlistItemRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(item -> toResponse(item.getProduct()))
                .toList();
    }

    public List<Long> getWishlistProductIds(String email) {
        User user = getUser(email);
        return wishlistItemRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(item -> item.getProduct().getId())
                .toList();
    }

    public ProductResponse add(String email, Long productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseGet(() -> {
                    WishlistItem item = new WishlistItem();
                    item.setUser(user);
                    item.setProduct(product);
                    return wishlistItemRepository.save(item);
                });

        return toResponse(product);
    }

    public void remove(String email, Long productId) {
        User user = getUser(email);
        wishlistItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getSlug(), p.getShortDescription(),
                p.getDescription(), p.getPrice(), p.getStock(), p.isActive(),
                p.getImages() == null ? Collections.emptyList() : p.getImages(),
                p.getCategory().getId(),
                p.getCategory().getName()
        );
    }
}
