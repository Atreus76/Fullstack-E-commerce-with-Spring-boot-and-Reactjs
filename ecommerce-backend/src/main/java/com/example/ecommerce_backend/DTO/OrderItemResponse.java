package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String productImage;
    private BigDecimal priceAtPurchase;
    private int quantity;
}
