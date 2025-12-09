package com.example.ecommerce_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TopProduct {
    private Long id;
    private String name;
    private String image;
    private int unitsSold;
}
