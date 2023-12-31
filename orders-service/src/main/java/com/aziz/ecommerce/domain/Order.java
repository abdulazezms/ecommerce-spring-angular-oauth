package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "t_orders")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @Column(name = "order_tracking_number")
    private String orderTrackingNumber;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "total_quantity")
    private Long totalQuantity;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "t_addresses_id_billing")
    private Address billingAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "t_addresses_id_shipping")
    private Address shippingAddress;

    @ManyToOne
    @JoinColumn(name = "t_customers_id")
    private Customer customer;

    @Column(name = "status")
    private String status;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    public void add(OrderItem orderItem){
        if(this.orderItems == null){
            this.orderItems = new ArrayList<>();
        }
        orderItem.setOrder(this);
        this.orderItems.add(orderItem);
    }
}
