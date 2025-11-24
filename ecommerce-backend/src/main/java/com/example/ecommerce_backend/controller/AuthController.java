package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.JwtResponse;
import com.example.ecommerce_backend.DTO.LoginRequest;
import com.example.ecommerce_backend.DTO.RefreshTokenRequest;
import com.example.ecommerce_backend.DTO.RegisterRequest;
import com.example.ecommerce_backend.model.RefreshToken;
import com.example.ecommerce_backend.model.Role;
import com.example.ecommerce_backend.model.User;
import com.example.ecommerce_backend.repository.UserRepository;
import com.example.ecommerce_backend.security.JwtUtils;
import com.example.ecommerce_backend.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String email = request.getEmail();

            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(email)
                    .password(userRepository.findByEmail(email).get().getPassword())
                    .authorities("ROLE_" + userRepository.findByEmail(email).get().getRole().name())
                    .build();

            String accessToken = jwtUtils.generateAccessToken(userDetails);

            // ONE AND ONLY CALL – THIS IS THE CORRECT ONE
            RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(email);

            return ResponseEntity.ok(new JwtResponse(
                    accessToken,
                    refreshTokenEntity.getToken()   // ← now it's NOT null
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtUtils.generateAccessToken(
                            new org.springframework.security.core.userdetails.User(
                                    user.getEmail(), user.getPassword(),
                                    List.of(new SimpleGrantedAuthority(user.getRole().name()))
                            )
                    );
                    return ResponseEntity.ok(new JwtResponse(accessToken, request.getRefreshToken()));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.ok("Logged out successfully");
    }
}
