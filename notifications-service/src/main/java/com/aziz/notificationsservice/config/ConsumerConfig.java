package com.aziz.notificationsservice.config;

import com.aziz.notificationsservice.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.ConcurrentKafkaListenerContainerFactoryConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.ConsumerRecordRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.ExponentialBackOffWithMaxRetries;
import org.springframework.util.backoff.ExponentialBackOff;

@Slf4j
@Configuration
public class ConsumerConfig {
    private final KafkaTemplate<Integer, String> kafkaTemplate;

    @Value("${spring.kafka.template.default-topic}")
    private String defaultTopic;

    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_RETRY = "RETRY";

    private final NotificationService notificationService;


    public ConsumerConfig(KafkaTemplate<Integer, String> kafkaTemplate, NotificationService notificationService) {
        this.kafkaTemplate = kafkaTemplate;
        this.notificationService = notificationService;
    }

    @Bean
    ConcurrentKafkaListenerContainerFactory<?, ?> kafkaListenerContainerFactory(
            ConcurrentKafkaListenerContainerFactoryConfigurer configurer,
            ConsumerFactory<Object, Object> consumerFactory)

    {
        log.info("Configuring ConcurrentKafkaListenerContainerFactory");
        ConcurrentKafkaListenerContainerFactory<Object, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        configurer.configure(factory, consumerFactory);
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean
    CommonErrorHandler errorHandler() {
        ExponentialBackOff exponentialBackOff = new ExponentialBackOffWithMaxRetries(2);
        exponentialBackOff.setInitialInterval(1_000L);
        exponentialBackOff.setMultiplier(2.0);

        var defaultErrorHandler = new DefaultErrorHandler(consumerRecordRecoverer(), exponentialBackOff);
        defaultErrorHandler.setRetryListeners((record, ex, deliveryAttempt) -> {
            log.info("Failed record. Exception: {}, Delivery attempt: {}",
                    ex.getMessage(), deliveryAttempt);
        });

        return defaultErrorHandler;
    }

    ConsumerRecordRecoverer consumerRecordRecoverer() {
        return  ((consumerRecord, e) -> {
            log.info("Saving record {} record with status RETRY", consumerRecord.value());
            notificationService.saveRecord(consumerRecord, e, STATUS_RETRY);
        });
    }
}
