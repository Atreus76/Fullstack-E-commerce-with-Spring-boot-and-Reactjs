package com.example.ecommerce_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CreateCategoryRequest {
    @NotBlank
    private String name;
    @NotNull
    private MultipartFile image;

    public CreateCategoryRequest(String name, MultipartFile image) {
        this.name = name;
        this.image = image;
    }
}
