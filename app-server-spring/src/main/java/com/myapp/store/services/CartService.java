package com.myapp.store.services;

import com.myapp.store.entities.Cart;
import com.myapp.store.exceptions.CartItemNotFoundException;
import com.myapp.store.exceptions.CartNotFoundException;
import com.myapp.store.repositories.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    private final ProductService productService;

    public Cart createCart() {
        var cart = new Cart();
        cartRepository.save(cart);
        return cart;
    }

    public Cart getCart(UUID cartId) {
        return cartRepository.findById(cartId).orElse(null);
    }


    public Cart addToCart(UUID cartId, Long productId) {

        var cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null) {
            throw new CartNotFoundException("Cart not found: " + cartId);
        }

        var product = productService.getProduct(productId);

        cart.addItem(product);
        cartRepository.save(cart);


        return cart;
    }


    public Cart updateItem(
            UUID cartId,
            Long productId,
            Integer quantity
    ) {
        var cart = getCart(cartId);
        var cartItem = cart.getItem(productId);

        if (cartItem == null) {
            throw new CartItemNotFoundException("Product " + productId + "is missing in Cart: " + cartId);
        }

        cartItem.setQuantity(quantity);
        cartRepository.save(cart);

        return cart;
    }

    public void removeItem(
            UUID cartId,
            Long productId
    ) {
        var cart = getCart(cartId);
        cart.removeItem(productId);
        cartRepository.save(cart);
    }
}
