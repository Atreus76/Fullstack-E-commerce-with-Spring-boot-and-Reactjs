package com.example.ecommerce_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadService {
    private final Cloudinary cloudinary;

    public String upload(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        Map<String, Object> options = ObjectUtils.asMap(
                "folder",         "ecommerce/categories",
                "resource_type",  "image",
                "quality",        "auto",
                "fetch_format",   "auto"
        );

        Map result = cloudinary.uploader().upload(file.getBytes(), options);
        return (String) result.get("secure_url");
    }

    public void deleteByUrl(String imageUrl) throws IOException {
        if (imageUrl == null || imageUrl.isBlank()) return;
        String publicId = imageUrl
                .substring(imageUrl.lastIndexOf("/") + 1)
                .replaceFirst("\\.[^.]+$", ""); // remove extension
        cloudinary.uploader().destroy("ecommerce/categories/" + publicId, ObjectUtils.emptyMap());
    }
}
