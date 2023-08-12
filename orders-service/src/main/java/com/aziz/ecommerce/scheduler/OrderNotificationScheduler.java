package com.aziz.ecommerce.scheduler;

import com.aziz.ecommerce.domain.OrderEventStatus;
import com.aziz.ecommerce.domain.OrderNotification;
import com.aziz.ecommerce.producer.OrderEventsProducer;
import com.aziz.ecommerce.service.OrderNotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class OrderNotificationScheduler {

    private final OrderEventsProducer orderEventsProducer;

    private final OrderNotificationService orderNotificationService;

    public OrderNotificationScheduler(OrderEventsProducer orderEventsProducer, OrderNotificationService orderNotificationService) {
        this.orderEventsProducer = orderEventsProducer;
        this.orderNotificationService = orderNotificationService;
    }


    @Scheduled(fixedRate = 30, timeUnit = TimeUnit.SECONDS)
    public void produceOrderEvents() {
        log.info("produceOrderEventsScheduler began...");
        orderNotificationService.findAll().forEach(orderNotification -> {

            //check if at least 60 seconds has passed.
            Date date = orderNotification.getDateCreated();

            // Get the current date and time
            Date currentDate = new Date();

            // Calculate the difference in seconds
            long differenceInSeconds = (currentDate.getTime() - date.getTime()) / 1000;

            if(differenceInSeconds > 30 && !orderNotification.isNotified()) {
                String orderStatus = orderNotification.getOrderStatus().name();
                try {
                    boolean inProgress = orderStatus.equals(OrderEventStatus.IN_PROGRESS.name());
                    boolean confirmed = orderStatus.equals(OrderEventStatus.CONFIRMED.name());
                    if(inProgress || confirmed) {
                        if(inProgress)  orderNotification.setOrderStatus(OrderEventStatus.FAILED);
                        log.info("Producing: {} ", orderNotification + " -> " + orderNotification.getOrderStatus());
                        orderEventsProducer.produceOrderNotificationEvent(orderNotification);
                        orderNotification.setNotified(true);
                        this.orderNotificationService.save(orderNotification);
                    }
                } catch (JsonProcessingException e) {
                    log.info("Error occurred while producing: {}", orderNotification);
                    throw new RuntimeException(e);
                }
            }
        });
        log.info("produceOrderEventsScheduler ended...");
    }
}
