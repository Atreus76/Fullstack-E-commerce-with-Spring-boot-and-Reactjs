package com.example.ecommerce_backend.DTO;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
public class UpdateProductRequest {
    private String name;
    private String shortDescription;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private List<MultipartFile> newImages;
}
