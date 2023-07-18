package com.aziz.ecommerce.service;
import com.aziz.ecommerce.dto.OrderHistoryDto;
import java.util.List;

public interface CustomerService {
    List<OrderHistoryDto> getOrders();

}
