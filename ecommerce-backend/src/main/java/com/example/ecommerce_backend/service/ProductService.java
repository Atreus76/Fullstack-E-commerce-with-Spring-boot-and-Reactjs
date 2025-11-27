package com.example.ecommerce_backend.service;

import com.example.ecommerce_backend.DTO.CreateProductRequest;
import com.example.ecommerce_backend.DTO.ProductResponse;
import com.example.ecommerce_backend.DTO.UpdateProductRequest;
import com.example.ecommerce_backend.model.Category;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.repository.CategoryRepository;
import com.example.ecommerce_backend.repository.ProductRepository;
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
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageUploadService imageUploadService;
    Slugify slugify = Slugify.builder()
            .locale(Locale.ENGLISH)
            .lowerCase(true)
            .build();
    public Product create(CreateProductRequest req) throws IOException {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String slug = generateUniqueSlug(req.getName());

        List<String> imageUrls = req.getImages().stream()
                .map(file -> {
                    try { return imageUploadService.upload(file); }
                    catch (IOException e) { throw new RuntimeException(e); }
                })
                .toList();

        Product product = Product.builder()
                .name(req.getName())
                .slug(slug)
                .shortDescription(req.getShortDescription())
                .description(req.getDescription())
                .price(req.getPrice())
                .stock(req.getStock() != null ? req.getStock() : 0)
                .images(imageUrls)
                .category(category)
                .active(true)
                .build();

        return productRepository.save(product);
    }

    public Product update(Long id, UpdateProductRequest req) throws IOException {
        Product product = productRepository.findById(id).orElseThrow();

        if (req.getName() != null && !req.getName().equals(product.getName())) {
            product.setSlug(generateUniqueSlug(req.getName()));
            product.setName(req.getName());
        }
        if (req.getShortDescription() != null) product.setShortDescription(req.getShortDescription());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getStock() != null) product.setStock(req.getStock());
        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId()).orElseThrow();
            product.setCategory(cat);
        }

        // Add new images if provided
        if (req.getNewImages() != null && !req.getNewImages().isEmpty()) {
            List<String> newUrls = req.getNewImages().stream()
                    .map(f -> { try { return imageUploadService.upload(f); } catch (IOException e) { throw new RuntimeException(e); } })
                    .toList();
            product.getImages().addAll(newUrls);
        }

        return productRepository.save(product);
    }

    public void delete(Long id) throws IOException {
        Product p = productRepository.findById(id).orElseThrow();
        for (String url : p.getImages()) {
            imageUploadService.deleteByUrl(url);
        }
        productRepository.delete(p);
    }

    private String generateUniqueSlug(String name) {
        String base = slugify.slugify(name);
        String slug = base;
        int i = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    // Public methods
    public List<ProductResponse> getAllActive() {
        return productRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getBySlug(String slug) {
        Product p = productRepository.findBySlug(slug).orElseThrow();
        return toResponse(p);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getSlug(), p.getShortDescription(),
                p.getDescription(), p.getPrice(), p.getStock(), p.isActive(),
                p.getImages(),
                p.getCategory().getId(),
                p.getCategory().getName()
        );
    }
}
