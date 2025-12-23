package com.myapp.store.controllers;

import com.myapp.store.dtos.AddItemToCartRequest;
import com.myapp.store.dtos.CartDto;
import com.myapp.store.dtos.CartItemDTO;
import com.myapp.store.entities.Cart;
import com.myapp.store.entities.CartItem;
import com.myapp.store.mappers.CartMapper;
import com.myapp.store.repositories.CartRepository;
import com.myapp.store.repositories.ProductRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/carts")
@AllArgsConstructor
public class CartController {

    private final CartRepository cartRepository;

    private final CartMapper cartMapper;
    private final ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<CartDto> createCart() {
        var cart = new Cart();
        cartRepository.save(cart);


        var cartDto = cartMapper.toDto(cart);

        return new ResponseEntity<>(cartDto, HttpStatus.CREATED);

    }

    @GetMapping ("/{cartId}")
    public ResponseEntity<CartDto> getCart(@PathVariable UUID cartId) {
        var cart = cartRepository.findById(cartId).orElse(null);

        if(cart == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cartMapper.toDto(cart));
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartItemDTO> addToCart(@PathVariable UUID cartId, @RequestBody @Valid AddItemToCartRequest request) {
        var cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        var product = productRepository.findById(request.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().build();
        }

        var cartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(1);
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + 1);
        }

        cartRepository.save(cart);

        var cartItemDto = cartMapper.toCartItemDto(cartItem);

        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemDto);
    }
}
