package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.CustomerDao;
import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.domain.Order;
import com.aziz.ecommerce.domain.OrderItem;
import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerDao customerDao;

    public CheckoutServiceImpl(CustomerDao customerDao){
        this.customerDao = customerDao;
    }
    @Override
    @Transactional
    public PurchaseResponseDto placeOrder(PurchaseRequestDto purchaseRequestDto) {
        Order order = purchaseRequestDto.getOrder();
        String orderTrackingNumber = UUID.randomUUID().toString();
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchaseRequestDto.getOrderItems();
        orderItems.forEach(order::add);

        order.setBillingAddress(purchaseRequestDto.getBillingAddress());
        order.setShippingAddress(purchaseRequestDto.getShippingAddress());

        Customer customer = purchaseRequestDto.getCustomer();
        customer.add(order);

        customerDao.save(customer);
        return PurchaseResponseDto.builder().orderTrackingNumber(orderTrackingNumber).build();
    }
}
