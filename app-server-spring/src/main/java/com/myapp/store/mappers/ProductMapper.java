package com.myapp.store.mappers;

import com.myapp.store.dtos.ProductDto;
import com.myapp.store.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductDto toProductDto(Product product);
}
