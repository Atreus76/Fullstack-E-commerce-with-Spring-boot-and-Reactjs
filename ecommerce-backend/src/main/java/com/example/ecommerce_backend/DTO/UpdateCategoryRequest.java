package com.example.ecommerce_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateCategoryRequest {
    @NotBlank
    private String name;
    private MultipartFile image;

    public UpdateCategoryRequest(String name, MultipartFile image) {
        this.name = name;
        this.image = image;
    }
}
