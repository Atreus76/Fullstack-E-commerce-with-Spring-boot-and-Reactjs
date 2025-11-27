package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.ProductResponse;
import com.example.ecommerce_backend.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/{slug}")
    public ProductResponse get(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }
}
