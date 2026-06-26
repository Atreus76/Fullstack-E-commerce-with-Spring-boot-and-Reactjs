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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private static final int MAX_PRODUCT_IMAGES = 5;
    private static final String PRODUCT_IMAGE_FOLDER = "ecommerce/products";

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
        List<String> imageUrls = uploadProductImages(req.getImages());

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

        List<MultipartFile> newImages = nonEmptyFiles(req.getNewImages());
        if (!newImages.isEmpty()) {
            List<String> currentImages = mutableImages(product.getImages());
            if (currentImages.size() + newImages.size() > MAX_PRODUCT_IMAGES) {
                throw new IllegalArgumentException("A product can have at most " + MAX_PRODUCT_IMAGES + " images");
            }
            currentImages.addAll(uploadProductImages(newImages));
            product.setImages(currentImages);
        }

        return productRepository.save(product);
    }

    public void delete(Long id) throws IOException {
        Product p = productRepository.findById(id).orElseThrow();
        for (String url : safeImages(p.getImages())) {
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

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Page<ProductResponse> searchProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.searchActiveProducts(keyword, categoryId, minPrice, maxPrice, pageable)
                .map(this::toResponse);
    }
    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getSlug(), p.getShortDescription(),
                p.getDescription(), p.getPrice(), p.getStock(), p.isActive(),
                safeImages(p.getImages()),
                p.getCategory().getId(),
                p.getCategory().getName()
        );
    }

    private List<String> uploadProductImages(List<MultipartFile> images) throws IOException {
        List<MultipartFile> files = nonEmptyFiles(images);
        if (files.size() > MAX_PRODUCT_IMAGES) {
            throw new IllegalArgumentException("A product can have at most " + MAX_PRODUCT_IMAGES + " images");
        }

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String uploadedUrl = imageUploadService.upload(file, PRODUCT_IMAGE_FOLDER);
            if (uploadedUrl != null) imageUrls.add(uploadedUrl);
        }
        return imageUrls;
    }

    private List<MultipartFile> nonEmptyFiles(List<MultipartFile> files) {
        if (files == null) return Collections.emptyList();
        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();
    }

    private List<String> safeImages(List<String> images) {
        return images == null ? Collections.emptyList() : images;
    }

    private List<String> mutableImages(List<String> images) {
        return images == null ? new ArrayList<>() : new ArrayList<>(images);
    }
}
