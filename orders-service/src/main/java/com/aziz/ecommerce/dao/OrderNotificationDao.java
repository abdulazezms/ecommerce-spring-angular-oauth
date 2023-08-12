package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.OrderNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderNotificationDao extends JpaRepository<OrderNotification, Integer> {
    Optional<OrderNotification> findByEmail(String email);
}
