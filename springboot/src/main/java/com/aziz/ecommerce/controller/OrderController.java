package com.aziz.ecommerce.controller;
import com.aziz.ecommerce.dto.OrderHistoryDto;
import com.aziz.ecommerce.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private CustomerService customerService;

    public OrderController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<OrderHistoryDto>> getOrdersHistory(){
        return new ResponseEntity<>(this.customerService.getOrders(), HttpStatus.OK);
    }
}
