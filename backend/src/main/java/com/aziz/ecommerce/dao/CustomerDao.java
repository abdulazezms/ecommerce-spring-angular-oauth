package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerDao extends JpaRepository<Customer, Long> {}
