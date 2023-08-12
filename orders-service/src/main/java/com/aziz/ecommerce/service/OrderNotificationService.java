package com.aziz.ecommerce.service;

import com.aziz.ecommerce.domain.OrderEventStatus;
import com.aziz.ecommerce.domain.OrderNotification;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface OrderNotificationService {
    void createOrderNotification(Jwt authenticationPrincipal, OrderEventStatus orderEventStatus);

    List<OrderNotification> findAll();

    void save(OrderNotification orderNotification);
}
