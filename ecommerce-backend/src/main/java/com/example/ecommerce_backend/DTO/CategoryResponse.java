package com.example.ecommerce_backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String image;

    public CategoryResponse(Long id, String name, String slug, String image) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.image = image;
    }
}
