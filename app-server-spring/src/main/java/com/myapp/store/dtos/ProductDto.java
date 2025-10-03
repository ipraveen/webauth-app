package com.myapp.store.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ProductDto {

    private Long id;

    private String name;

    private String description;

    private double price;

    private long categoryId;
}