package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class OrderSummary {
    private Long orderId;
    private String customerEmail;
    private BigDecimal total;
    private String status;
    private LocalDateTime date;
}
