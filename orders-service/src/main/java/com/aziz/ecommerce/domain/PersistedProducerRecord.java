package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_producer_records")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PersistedProducerRecord {
    @Id
    private Long id;

    @Column(name = "key_value")
    private Integer keyValue;

    @Column(name = "record_value", columnDefinition = "TEXT")
    private String recordValue;

    @Column(columnDefinition = "TEXT")
    private String exception;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProducerRecordStatus status;

    @Column(name = "t_timestamp")
    private Long timestamp;
}
