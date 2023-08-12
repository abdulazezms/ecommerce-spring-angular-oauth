package com.aziz.notificationsservice.service;

import com.aziz.notificationsservice.dao.NotificationDao;
import com.aziz.notificationsservice.entity.Notification;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final NotificationDao notificationsDao;

    public NotificationServiceImpl(NotificationDao notificationsDao) {
        this.notificationsDao = notificationsDao;
    }
    @Override
    public void saveRecord(ConsumerRecord<?, ?> consumerRecord, Exception e, String status) {
        Notification notification =
                Notification
                        .builder()
                        .topic(consumerRecord.topic())
                        .partition(consumerRecord.partition())
                        .offsetValue(consumerRecord.offset())
                        .exception(e==null? null:e.getMessage())
                        .recordValue(consumerRecord.value().toString())
                        .timestamp(consumerRecord.timestamp())
                        .status(status)
                        .build();
        System.out.println("SAVING NOTIFICATION: " + notification);
        this.notificationsDao.save(notification);
    }
}
