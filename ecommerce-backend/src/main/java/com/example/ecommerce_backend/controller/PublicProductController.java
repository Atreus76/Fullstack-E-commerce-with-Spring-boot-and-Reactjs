package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.ProductResponse;
import com.example.ecommerce_backend.model.Product;
import com.example.ecommerce_backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class PublicProductController {
    private final ProductService productService;

    public PublicProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> list() {
        return productService.getAllActive();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> results = productService.searchProducts(keyword);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{slug:(?!search$)[a-z0-9][a-z0-9-]*}")
    public ProductResponse get(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
