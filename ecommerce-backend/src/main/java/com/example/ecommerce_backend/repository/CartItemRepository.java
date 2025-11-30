package com.example.ecommerce_backend.repository;

import com.example.ecommerce_backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
