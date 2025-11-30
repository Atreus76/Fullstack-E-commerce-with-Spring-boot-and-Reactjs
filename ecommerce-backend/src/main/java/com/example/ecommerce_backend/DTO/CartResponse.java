package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
public class CartResponse {
    private List<CartItemResponse> items;
    private BigDecimal total;
}
