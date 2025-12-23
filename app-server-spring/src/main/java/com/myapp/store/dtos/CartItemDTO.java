package com.myapp.store.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemDTO {

    private CartProductDto product;

    private int quantity;

    private BigDecimal totalPrice;
}
