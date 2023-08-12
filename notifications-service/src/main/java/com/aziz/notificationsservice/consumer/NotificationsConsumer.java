package com.aziz.notificationsservice.consumer;

import com.aziz.notificationsservice.config.ConsumerConfig;
import com.aziz.notificationsservice.dto.OrderNotification;
import com.aziz.notificationsservice.service.NotificationService;
import com.aziz.notificationsservice.utils.EmailMessagingUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@Slf4j
public class NotificationsConsumer {
    private final ObjectMapper objectMapper;
    private final EmailMessagingUtils emailMessagingUtils;

    private final NotificationService notificationService;


    public NotificationsConsumer(EmailMessagingUtils emailMessagingUtils, NotificationService notificationService){
        this.objectMapper = new ObjectMapper();
        this.emailMessagingUtils = emailMessagingUtils;
        this.notificationService = notificationService;
    }
    @KafkaListener(topics = {"${env.topics.order-events}"},
            groupId = "${spring.kafka.consumer.group-id}")
    public void onMessage(ConsumerRecord<Integer, String> consumerRecord) throws JsonProcessingException {
        System.out.println("Received consumer record " + consumerRecord + " with value " + consumerRecord.value() );
        OrderNotification orderNotification = this.objectMapper.readValue(consumerRecord.value(),
                OrderNotification.class);

        log.info("NOTIFICATIONS SERVICE - Consumer Record Received: {}", consumerRecord +
                ", and the POJO is " + orderNotification);
        this.emailMessagingUtils.sendMailOrderStatus(orderNotification.getEmail(),
                orderNotification.getOrderStatus().name());
        this.notificationService.saveRecord(consumerRecord, null, ConsumerConfig.STATUS_SUCCESS);


    }
}
