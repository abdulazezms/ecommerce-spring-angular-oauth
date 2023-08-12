package com.aziz.notificationsservice.dao;

import com.aziz.notificationsservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationDao extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByStatus(String status);
}
