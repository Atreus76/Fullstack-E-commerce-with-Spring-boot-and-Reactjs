package com.example.ecommerce_backend.repository;

import com.example.ecommerce_backend.model.RefreshToken;
import com.example.ecommerce_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
