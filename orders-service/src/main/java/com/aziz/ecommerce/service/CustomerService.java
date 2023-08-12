package com.aziz.ecommerce.service;
import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.dto.OrderHistoryDto;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<OrderHistoryDto> getOrders();

    Optional<Customer> findByEmail(String email);

    Customer save(Customer customer);
}
