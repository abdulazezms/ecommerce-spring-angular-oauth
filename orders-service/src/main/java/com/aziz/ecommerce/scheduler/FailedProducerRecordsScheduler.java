package com.aziz.ecommerce.scheduler;

import com.aziz.ecommerce.domain.OrderNotification;
import com.aziz.ecommerce.domain.ProducerRecordStatus;
import com.aziz.ecommerce.producer.OrderEventsProducer;
import com.aziz.ecommerce.service.PersistedProducerRecordService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class FailedProducerRecordsScheduler {

    private final PersistedProducerRecordService persistedProducerRecordService;
    private final OrderEventsProducer orderEventsProducer;

    private final ObjectMapper objectMapper;

    public FailedProducerRecordsScheduler(PersistedProducerRecordService persistedProducerRecordService,
                                          OrderEventsProducer orderEventsProducer) {
        this.persistedProducerRecordService = persistedProducerRecordService;
        this.orderEventsProducer = orderEventsProducer;
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(fixedRate = 60, timeUnit = TimeUnit.SECONDS)
    public void publishFailedRecords() {
        log.info("publishFailedRecords began...");
        this.persistedProducerRecordService
                .findAllByStatus(ProducerRecordStatus.FAILURE)
                .forEach(persistedProducerRecord -> {
                    log.info("Retrying to produce the event "  + persistedProducerRecord);
                    try {
                        OrderNotification orderNotification = this.objectMapper
                                .readValue(persistedProducerRecord.getRecordValue(), OrderNotification.class);
                        this.orderEventsProducer.produceOrderNotificationEvent(orderNotification);
                    } catch (JsonProcessingException e) {
                        log.info("Failed to reproduce " + persistedProducerRecord);
                        throw new RuntimeException(e);
                    }
                });
        log.info("publishFailedRecords ended...");
    }
}

