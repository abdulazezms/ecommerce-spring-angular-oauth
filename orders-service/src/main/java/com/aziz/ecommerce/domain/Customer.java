package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "t_customers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;


    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private Set<Order> orders;

    @Column(name = "email", unique = true)
    private String email;


    public void add(Order order){
        if(this.orders == null){
            this.orders = new HashSet<>();
        }
        order.setCustomer(this);
        this.orders.add(order);
    }
}
