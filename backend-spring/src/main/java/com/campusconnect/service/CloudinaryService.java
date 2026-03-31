package com.campusconnect.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUri = "data:" + file.getContentType() + ";base64," + base64;

        @SuppressWarnings("unchecked")
        Map<String, Object> result = cloudinary.uploader().upload(dataUri, ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image"
        ));

        return (String) result.get("secure_url");
    }
}
