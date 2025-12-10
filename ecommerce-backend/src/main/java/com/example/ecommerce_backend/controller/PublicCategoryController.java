package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.CategoryResponse;
import com.example.ecommerce_backend.model.Category;
import com.example.ecommerce_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin
public class PublicCategoryController {
    private final CategoryRepository categoryRepository;

    // PUBLIC: Get all categories (with image, name, slug)
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> new CategoryResponse(
                        cat.getId(),
                        cat.getName(),
                        cat.getSlug(),
                        cat.getImage()
                ))
                .toList();
    }

    // PUBLIC: Get single category by slug (optional bonus)
    @GetMapping("/{slug}")
    public CategoryResponse getCategoryBySlug(@PathVariable String slug) {
        Category cat = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new CategoryResponse(cat.getId(), cat.getName(), cat.getSlug(), cat.getImage());
    }
}
