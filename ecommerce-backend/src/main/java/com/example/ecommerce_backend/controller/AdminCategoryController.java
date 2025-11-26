package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.CategoryResponse;
import com.example.ecommerce_backend.DTO.CreateCategoryRequest;
import com.example.ecommerce_backend.DTO.UpdateCategoryRequest;
import com.example.ecommerce_backend.model.Category;
import com.example.ecommerce_backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {
    private final CategoryService categoryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> create(@Valid CreateCategoryRequest req) throws IOException {
        Category cat = categoryService.create(req);
        return ResponseEntity.ok(new CategoryResponse(cat.getId(), cat.getName(), cat.getSlug(), cat.getImage()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, UpdateCategoryRequest req) throws IOException {
        Category cat = categoryService.update(id, req);
        return ResponseEntity.ok(new CategoryResponse(cat.getId(), cat.getName(), cat.getSlug(), cat.getImage()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) throws IOException {
        categoryService.delete(id);
        return ResponseEntity.ok("Category deleted");
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CategoryResponse getOne(@PathVariable Long id) {
        return categoryService.getById(id);
    }
}
