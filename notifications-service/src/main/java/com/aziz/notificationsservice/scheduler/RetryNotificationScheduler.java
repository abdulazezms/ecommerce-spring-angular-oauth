package com.aziz.notificationsservice.scheduler;

import com.aziz.notificationsservice.config.ConsumerConfig;
import com.aziz.notificationsservice.dao.NotificationDao;
import com.aziz.notificationsservice.dto.OrderNotification;
import com.aziz.notificationsservice.entity.Notification;
import com.aziz.notificationsservice.utils.EmailMessagingUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;
@Slf4j
@Component
public class RetryNotificationScheduler {
    private final NotificationDao notificationsDao;

    private final EmailMessagingUtils emailMessagingUtils;

    private final ObjectMapper objectMapper;

    public RetryNotificationScheduler(NotificationDao notificationsDao, EmailMessagingUtils emailMessagingUtils) {
        this.notificationsDao = notificationsDao;
        this.emailMessagingUtils = emailMessagingUtils;
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(fixedRate = 60, timeUnit = TimeUnit.SECONDS)
    public void retryFailedNotification() {
        log.info("Scheduler RetryNotificationScheduler began");
        List<Notification> failedNotificationList = notificationsDao.findAllByStatus(ConsumerConfig.STATUS_RETRY);
        failedNotificationList.forEach(failedNotification -> {
            try{
                log.info("Retrying: " + failedNotification);

                //build an order event
                OrderNotification orderNotification = this.objectMapper.readValue(failedNotification.getRecordValue(),
                        OrderNotification.class);

                //try again to send the email
                emailMessagingUtils.sendMailOrderStatus(orderNotification.getEmail(), orderNotification.getOrderStatus().name());

                //set the status of the failure record to success, since it has been updated successfully
                failedNotification.setStatus(ConsumerConfig.STATUS_SUCCESS);

                //save again the failed record with its new status
                notificationsDao.save(failedNotification);

            } catch (Exception e) {
                log.info("Exception in retryFailedNotification, message: {}", e.getMessage(), e);
            }
        });
    }

}
