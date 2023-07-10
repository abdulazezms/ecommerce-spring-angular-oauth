package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDao extends JpaRepository<Product, Long> {}
