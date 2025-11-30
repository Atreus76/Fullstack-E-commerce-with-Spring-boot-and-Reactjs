package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
public class CartItemResponse {
    private Long productId;
    private String name;
    private String slug;
    private String image;
    private BigDecimal price;
    private int quantity;
}
