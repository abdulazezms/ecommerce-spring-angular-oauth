package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin("http://localhost:4200")
public interface ProductDao extends JpaRepository<Product, Long> {
    //exposes endpoint at /search/<query-method-name>
    Page<Product> findByProductCategoryId(@Param("id") Long id, Pageable pageable);
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
