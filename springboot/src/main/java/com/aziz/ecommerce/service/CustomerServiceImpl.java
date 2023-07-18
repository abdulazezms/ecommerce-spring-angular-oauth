package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.CustomerDao;
import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.domain.Order;
import com.aziz.ecommerce.dto.OrderHistoryDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
        //create the user in case we have a new user.
        Customer customer = customerDao.findByEmail(email).orElseGet(() -> customerDao.save(Customer.builder().email(email).build()));
        Set<Order> customerOrders = customer.getOrders();
        if(customerOrders == null || customerOrders.isEmpty()){
            return new ArrayList<>();
        }
        return customer.getOrders().stream().map(this::orderToOrderHistoryDto).toList();
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
