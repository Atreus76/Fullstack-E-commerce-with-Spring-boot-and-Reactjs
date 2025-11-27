package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.DTO.CreateProductRequest;
import com.example.ecommerce_backend.DTO.UpdateProductRequest;
import com.example.ecommerce_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasAuthority('ADMIN')")
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@Valid CreateProductRequest req) throws IOException {
        return ResponseEntity.ok(productService.create(req));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable Long id, UpdateProductRequest req) throws IOException {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws IOException {
        productService.delete(id);
        return ResponseEntity.ok("Product deleted");
    }
}
