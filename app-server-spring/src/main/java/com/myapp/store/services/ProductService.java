package com.myapp.store.services;

import com.myapp.store.entities.Product;
import com.myapp.store.exceptions.ProductNotFoundException;
import com.myapp.store.repositories.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product getProduct(Long productId) {
        var product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        return product;
    }
}
