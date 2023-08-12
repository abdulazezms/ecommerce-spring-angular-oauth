package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Table(name = "t_orders_notifications")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class OrderNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;


    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderEventStatus orderStatus;

    private boolean notified;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

}
