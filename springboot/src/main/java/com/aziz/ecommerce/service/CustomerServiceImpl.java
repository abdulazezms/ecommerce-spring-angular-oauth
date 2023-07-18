package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.CustomerDao;
import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.domain.Order;
import com.aziz.ecommerce.dto.OrderHistoryDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService{
    private CustomerDao customerDao;

    public CustomerServiceImpl(CustomerDao customerDao){
        this.customerDao = customerDao;
    }

    @Override
    public List<OrderHistoryDto> getOrders() {
        Jwt authenticationPrincipal = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = authenticationPrincipal.getSubject();
        Customer c = this.customerDao
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No such customer exists"));
        return c.getOrders().stream().map(this::orderToOrderHistoryDto).toList();
    }

    private OrderHistoryDto orderToOrderHistoryDto(Order order) {
        return OrderHistoryDto
                .builder()
                .dateCreated(order.getDateCreated())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .totalQuantity(order.getTotalQuantity())
                .orderTrackingNumber(order.getOrderTrackingNumber())
                .build();
    }
}
