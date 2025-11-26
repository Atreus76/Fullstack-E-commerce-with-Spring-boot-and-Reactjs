package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.DTO.CategoryResponse;
import com.example.ecommerce_backend.DTO.CreateCategoryRequest;
import com.example.ecommerce_backend.DTO.UpdateCategoryRequest;
import com.example.ecommerce_backend.model.Category;
import com.example.ecommerce_backend.repository.CategoryRepository;
import com.github.slugify.Slugify;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ImageUploadService imageUploadService;

    public Category create(CreateCategoryRequest req) throws IOException {
        if (categoryRepository.existsByName(req.getName()))
            throw new RuntimeException("Category name already exists");

        String imageUrl = imageUploadService.upload(req.getImage());
        Slugify slugify = Slugify.builder()
                .locale(Locale.ENGLISH)
                .lowerCase(true)
                .build();


        Category cat = Category.builder()
                .name(req.getName())
                .slug(slugify.slugify(req.getName()))
                .image(imageUrl)
                .build();

        return categoryRepository.save(cat);
    }

    public Category update(Long id, UpdateCategoryRequest req) throws IOException {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!cat.getName().equals(req.getName()) && categoryRepository.existsByName(req.getName()))
            throw new RuntimeException("Category name already exists");

        // delete old image if new one provided
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            imageUploadService.deleteByUrl(cat.getImage());
            cat.setImage(imageUploadService.upload(req.getImage()));
        }
        Slugify slugify = Slugify.builder()
                .locale(Locale.ENGLISH)
                .lowerCase(true)
                .build();

        cat.setName(req.getName());
        cat.setSlug(slugify.slugify(req.getName()));
        return categoryRepository.save(cat);
    }

    public void delete(Long id) throws IOException {
        Category cat = categoryRepository.findById(id).orElseThrow();
        if (cat.getImage() != null) imageUploadService.deleteByUrl(cat.getImage());
        categoryRepository.delete(cat);
    }

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getImage()))
                .toList();
    }

    public CategoryResponse getById(Long id) {
        Category c = categoryRepository.findById(id).orElseThrow();
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getImage());
    }
}
