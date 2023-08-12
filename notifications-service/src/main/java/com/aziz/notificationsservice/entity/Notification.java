package com.aziz.notificationsservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "t_notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(name = "key_value")
    private Integer keyValue;

    @Column(name = "record_value")
    private String recordValue;

    @Column(name = "c_partition")
    private Integer partition;

    @Column(name = "offset_value")
    private Long offsetValue;

    private String exception;

    private String status;

    @Column(name = "c_timestamp")
    private Long timestamp;
}
