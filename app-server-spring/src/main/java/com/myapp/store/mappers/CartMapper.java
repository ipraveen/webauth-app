package com.myapp.store.mappers;

import com.myapp.store.dtos.CartDto;
import com.myapp.store.dtos.CartItemDTO;
import com.myapp.store.entities.Cart;
import com.myapp.store.entities.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "totalPrice", expression = "java(cart.getTotalPrice())")
    CartDto toDto(Cart cart);

    @Mapping(target = "totalPrice", expression = "java(cartItem.getTotalPrice())")
    CartItemDTO toCartItemDto(CartItem cartItem);

}

