package com.myapp.store.repositories;

import com.myapp.store.entities.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Minimize the number of Query to Database.
    @Query("SELECT p  FROM Product  p JOIN FETCH p.category")
    List<Product> findAllWithCategory();

    @EntityGraph(attributePaths = "category")
    List<Product> findByCategoryId(Long categoryId);
}