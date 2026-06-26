package com.example.ecommerce_backend.DTO;

import jakarta.validation.constraints.Size;
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
    @Size(max = 5, message = "A product can have at most 5 new images per update")
    private List<MultipartFile> newImages;
}
