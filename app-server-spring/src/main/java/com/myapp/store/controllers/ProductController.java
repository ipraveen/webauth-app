package com.myapp.store.controllers;


import com.myapp.store.dtos.ProductDto;
import com.myapp.store.entities.Product;
import com.myapp.store.mappers.ProductMapper;
import com.myapp.store.repositories.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
@Slf4j
public class ProductController {


    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProduct(@RequestParam(required = false) Long categoryId) {

        log.info("Fetching all Products. Optional categoryId: {}", categoryId);
        List<Product> products = null;
        if (categoryId == null) {
            products = productRepository.findAllWithCategory();
        } else {
            products = productRepository.findByCategoryId(categoryId);
        }

        return ResponseEntity.ok(products
                .stream()
                .map(productMapper::toProductDto)
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable long id) {
        var product = productRepository.findById(id).orElse(null);

        if (product == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(productMapper.toProductDto(product));
    }
}
