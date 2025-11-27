package com.example.ecommerce_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
public class CreateProductRequest {
    @NotBlank
    private String name;
    private String shortDescription;
    private String description;
    @NotNull
    private BigDecimal price;
    private Integer stock;
    @NotNull
    private Long categoryId;
    @NotNull
    private List<MultipartFile> images;
}
