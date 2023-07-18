package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerDao extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(@Param("email") String email);

}
