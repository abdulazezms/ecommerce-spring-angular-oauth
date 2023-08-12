package com.aziz.notificationsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderNotification {
    private Integer id;
    private String email;
    private OrderEventStatus orderStatus;
    private boolean notified;
    private Date dateCreated;
    private Date lastUpdated;
}
