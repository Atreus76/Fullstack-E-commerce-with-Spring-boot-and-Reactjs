package com.example.ecommerce_backend.repository;

import com.example.ecommerce_backend.model.Order;
import com.example.ecommerce_backend.model.User;
import com.example.ecommerce_backend.status.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByStripePaymentIntentId(String paymentIntentId);

    Optional<Order> findById(Long orderId);

    Optional<Order> findByIdAndUser(Long id, User user);

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findAllByUserEmailOrderByCreatedAtDesc(String name);

    Optional<Order> findFirstByUserEmailAndStatusOrderByCreatedAtDesc(String email, OrderStatus status);

    // Optional: admin can see all
    List<Order> findAllByOrderByCreatedAtDesc();
}
