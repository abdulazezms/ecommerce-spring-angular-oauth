package com.aziz.ecommerce.dto;


import com.aziz.ecommerce.domain.Address;
import com.aziz.ecommerce.domain.Order;
import com.aziz.ecommerce.domain.OrderItem;
import lombok.Data;
import java.util.Set;

@Data

public class PurchaseRequestDto {
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
