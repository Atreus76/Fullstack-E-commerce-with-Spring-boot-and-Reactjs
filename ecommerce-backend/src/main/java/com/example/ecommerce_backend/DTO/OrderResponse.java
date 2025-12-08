package com.example.ecommerce_backend.DTO;

import com.example.ecommerce_backend.status.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String stripePaymentIntentId;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt = LocalDateTime.now();
    private List<OrderItemResponse> items = new ArrayList<>();
    private String clientSecret;

}
