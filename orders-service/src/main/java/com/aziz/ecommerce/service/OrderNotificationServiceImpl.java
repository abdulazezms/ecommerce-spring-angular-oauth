package com.aziz.ecommerce.service;

import com.aziz.ecommerce.dao.OrderNotificationDao;
import com.aziz.ecommerce.domain.OrderEventStatus;
import com.aziz.ecommerce.domain.OrderNotification;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderNotificationServiceImpl implements OrderNotificationService{

    private final OrderNotificationDao orderNotificationDao;

    public OrderNotificationServiceImpl(OrderNotificationDao orderNotificationDao) {
        this.orderNotificationDao = orderNotificationDao;
    }
    @Override
    public void createOrderNotification(Jwt authenticationPrincipal, OrderEventStatus orderEventStatus) {
        String email = authenticationPrincipal.getSubject();
        OrderNotification orderNotification = this.orderNotificationDao
                .findByEmail(email)
                .orElse(OrderNotification
                .builder()
                        .email(email)
                .build());
        orderNotification.setOrderStatus(orderEventStatus);
        orderNotification.setNotified(false);
        orderNotificationDao.save(orderNotification);
    }

    @Override
    public List<OrderNotification> findAll() {
        return this.orderNotificationDao.findAll();
    }

    @Override
    public void save(OrderNotification orderNotification) {
        this.orderNotificationDao.save(orderNotification);
    }
}
