package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.DTO.CartItemResponse;
import com.example.ecommerce_backend.DTO.CartResponse;
import com.example.ecommerce_backend.model.Cart;
import com.example.ecommerce_backend.model.CartItem;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.model.User;
import com.example.ecommerce_backend.repository.CartRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
import com.example.ecommerce_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Get or create cart for current user
    public Cart getCartForUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addToCart(String email, Long productId, int quantity) {
        Cart cart = getCartForUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isActive()) throw new RuntimeException("Product is not available");

        cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresentOrElse(
                        CartItem::increase,
                        () -> cart.addItem(new CartItem() {{ setProduct(product); setQuantity(quantity); }})
                );

        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String email, Long productId, int quantity) {
        Cart cart = getCartForUser(email);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        if (quantity <= 0) {
            cart.removeItem(item);
        } else {
            item.setQuantity(quantity);
        }
        return cartRepository.save(cart);
    }

    public void removeItem(String email, Long productId) {
        Cart cart = getCartForUser(email);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
    }

    public void clearCart(String email) {
        Cart cart = getCartForUser(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // DTO conversion
    public CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getSlug(),
                        item.getProduct().getImages().get(0),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();

        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, total);
    }
}
