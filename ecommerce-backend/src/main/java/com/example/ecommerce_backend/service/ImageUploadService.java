package com.example.ecommerce_backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadService {
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;
    private static final String DEFAULT_FOLDER = "ecommerce/categories";

    private final Cloudinary cloudinary;

    public String upload(MultipartFile file) throws IOException {
        return upload(file, DEFAULT_FOLDER);
    }

    public String upload(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) return null;
        validateImage(file);

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "quality", "auto",
                "fetch_format", "auto"
        );

        Map result = cloudinary.uploader().upload(file.getBytes(), options);
        return (String) result.get("secure_url");
    }

    public void deleteByUrl(String imageUrl) throws IOException {
        String publicId = extractPublicId(imageUrl);
        if (publicId == null) return;
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    private void validateImage(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (file.getSize() > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("Each image must be 5MB or smaller");
        }
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return null;

        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) return null;

        String publicPath = parts[1];
        String[] segments = publicPath.split("/");
        if (segments.length > 0 && segments[0].matches("v\\d+")) {
            publicPath = String.join("/", Arrays.copyOfRange(segments, 1, segments.length));
        }

        return publicPath.replaceFirst("\\.[^.]+$", "");
    }
}
