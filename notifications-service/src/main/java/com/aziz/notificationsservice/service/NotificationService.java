package com.aziz.notificationsservice.service;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public interface NotificationService {
    void saveRecord(ConsumerRecord<?,?> consumerRecord, Exception e, String status);
}
