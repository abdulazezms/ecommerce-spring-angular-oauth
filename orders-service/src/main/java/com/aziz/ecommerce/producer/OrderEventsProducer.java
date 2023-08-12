package com.aziz.ecommerce.producer;

import com.aziz.ecommerce.domain.OrderNotification;
import com.aziz.ecommerce.domain.PersistedProducerRecord;
import com.aziz.ecommerce.domain.ProducerRecordStatus;
import com.aziz.ecommerce.service.PersistedProducerRecordService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
public class OrderEventsProducer {
    @Value("${env.topics.order-events}")
    private String orderEventsTopic;

    private final KafkaTemplate<Integer, String> kafkaTemplate;

    private final ObjectMapper objectMapper;

    private final PersistedProducerRecordService persistedProducerRecordService;


    public OrderEventsProducer(KafkaTemplate<Integer, String> kafkaTemplate,
                               ObjectMapper objectMapper,
                               PersistedProducerRecordService persistedProducerRecordService) {

        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.persistedProducerRecordService = persistedProducerRecordService;
    }


    private ProducerRecord<Integer, String> getProducerRecord(String topic, Integer key, String value) {
        return new ProducerRecord<>(topic, key, value);
    }

    public CompletableFuture<SendResult<Integer, String>> produceOrderNotificationEvent(OrderNotification orderNotification) throws JsonProcessingException {
        Integer key = orderNotification.getId();
        String value = objectMapper.writeValueAsString(orderNotification);

        ProducerRecord<Integer, String> record = getProducerRecord(orderEventsTopic, key, value);
        CompletableFuture<SendResult<Integer, String>> completableFuture = kafkaTemplate.send(record);

        return completableFuture.whenComplete(((sendResult, throwable) -> {
            if (throwable != null) {
                //an error occurred.
                handleFailure(key, value, throwable, orderNotification);
            } else {
                //record was produced successfully.
                handleSuccess(key, value, sendResult, orderNotification);
            }
        }));
    }

    private void handleSuccess(Integer key, String value, SendResult<Integer, String> sendResult, OrderNotification orderNotification) {
        Integer id = orderNotification.getId();
        PersistedProducerRecord persistedProducerRecord = PersistedProducerRecord
                .builder()
                .status(ProducerRecordStatus.SUCCESS)
                .recordValue(value)
                .keyValue(key)
                .id(Long.valueOf(key))
                .timestamp(new Date().getTime())
                .build();
        this.persistedProducerRecordService.save(persistedProducerRecord);

        //Store the current record's ID with status success, since the record has been published to the topic.
        log.info("Message with key: {}, and value: {}, has been sent successfully at partition: {}",
                key, value, sendResult.getRecordMetadata().partition());
    }

    private void handleFailure(Integer key, String value, Throwable throwable, OrderNotification orderNotification) {
        Integer id = orderNotification.getId();
        PersistedProducerRecord persistedProducerRecord = PersistedProducerRecord
                .builder()
                .keyValue(key)
                .id(Long.valueOf(key))
                .recordValue(value)
                .exception(throwable.getMessage())
                .status(ProducerRecordStatus.FAILURE)
                .timestamp(new Date().getTime())
                .build();
        this.persistedProducerRecordService.save(persistedProducerRecord);
        log.info("Message with key: {}, and value: {}, has resulted in an error: {}",
                key, value, throwable.getMessage());
    }
}
