package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.CustomerDao;
import com.aziz.ecommerce.domain.Customer;
import com.aziz.ecommerce.domain.Order;
import com.aziz.ecommerce.domain.OrderItem;
import com.aziz.ecommerce.dto.PurchaseRequestDto;
import com.aziz.ecommerce.dto.PurchaseResponseDto;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerDao customerDao;

    public CheckoutServiceImpl(CustomerDao customerDao){
        this.customerDao = customerDao;
    }

    /**
     * place a new order for a given authenticated customer.
     * If the customer doesn't exist, a new one will be created based on the unique email.
     * @param purchaseRequestDto
     * @return
     */

    @Override
    @Transactional
    public PurchaseResponseDto placeOrder(PurchaseRequestDto purchaseRequestDto) {
        Jwt authenticationPrincipal = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = authenticationPrincipal.getSubject();
        System.out.println("The email of the authenticated user is " + email);
        System.out.println("jwt's claims: " + authenticationPrincipal.getClaims());
        //storing the user in case we have a new user.
        Customer customer = customerDao.findByEmail(email).orElseGet(() -> customerDao.save(Customer.builder().email(email).build()));


        Order order = purchaseRequestDto.getOrder();
        String orderTrackingNumber = UUID.randomUUID().toString();
        order.setStatus("In Progress");
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchaseRequestDto.getOrderItems();
        orderItems.forEach(order::add);

        order.setBillingAddress(purchaseRequestDto.getBillingAddress());
        order.setShippingAddress(purchaseRequestDto.getShippingAddress());

        customer.add(order);
        customerDao.save(customer);
        return PurchaseResponseDto.builder().orderTrackingNumber(orderTrackingNumber).build();
    }


}
