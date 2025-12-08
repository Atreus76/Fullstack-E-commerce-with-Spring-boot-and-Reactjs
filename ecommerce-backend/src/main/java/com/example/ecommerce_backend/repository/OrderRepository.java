package com.example.ecommerce_backend.repository;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByStripePaymentIntentId(String paymentIntentId);

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findAllByUserEmailOrderByCreatedAtDesc(String name);

    // Optional: admin can see all
    List<Order> findAllByOrderByCreatedAtDesc();
}
