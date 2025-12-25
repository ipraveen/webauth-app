package com.myapp.store.controllers;

import com.myapp.store.dtos.AddItemToCartRequest;
import com.myapp.store.dtos.CartDto;
import com.myapp.store.dtos.UpdateCartItemRequest;
import com.myapp.store.exceptions.CartItemNotFoundException;
import com.myapp.store.exceptions.CartNotFoundException;
import com.myapp.store.exceptions.ProductNotFoundException;
import com.myapp.store.mappers.CartMapper;
import com.myapp.store.repositories.CartRepository;
import com.myapp.store.repositories.ProductRepository;
import com.myapp.store.services.CartService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/carts")
@AllArgsConstructor
public class CartController {

    private final CartRepository cartRepository;

    private final CartService cartService;

    private final CartMapper cartMapper;
    private final ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<CartDto> createCart() {
        var cart = cartService.createCart();
        var cartDto = cartMapper.toDto(cart);
        return new ResponseEntity<>(cartDto, HttpStatus.CREATED);
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<CartDto> getCart(@PathVariable UUID cartId) {
        var cart = cartService.getCart(cartId);

        if (cart == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cartMapper.toDto(cart));
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartDto> addToCart(@PathVariable UUID cartId, @RequestBody @Valid AddItemToCartRequest request) {
        var cart = cartService.addToCart(cartId, request.getProductId());
        var cartDto = cartMapper.toDto(cart);

        return ResponseEntity.status(HttpStatus.CREATED).body(cartDto);
    }

    @PutMapping("/{cartId}/items/{productId}")
    public ResponseEntity<?> updateItem(
            @PathVariable UUID cartId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {

        var cart = cartService.updateItem(cartId, productId, request.getQuantity());

        return ResponseEntity.status(HttpStatus.OK).body(cartMapper.toDto(cart));
    }

    @DeleteMapping("/{cartId}/items/{productId}")
    public ResponseEntity<?> removeItem(
            @PathVariable UUID cartId,
            @PathVariable Long productId
    ) {
        cartService.removeItem(cartId, productId);

        return ResponseEntity.noContent().build();
    }


    /*
     * Exception Handling
     */
    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCartNotFoundException(CartNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductNotFoundException(ProductNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(CartItemNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCartItemNotFoundException(CartItemNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }


}
