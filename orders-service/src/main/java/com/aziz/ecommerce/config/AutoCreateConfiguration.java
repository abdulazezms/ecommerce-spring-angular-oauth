package com.aziz.ecommerce.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class AutoCreateConfiguration {

    @Value("${env.topics.order-events}")
    private String orderEventsTopic;
    @Bean
    public NewTopic orderEvents() {
        System.out.println("Creating " + orderEventsTopic + " topic");
        return TopicBuilder
                .name(orderEventsTopic)
                .replicas(3)
                .partitions(3)
                .build();
    }
}
