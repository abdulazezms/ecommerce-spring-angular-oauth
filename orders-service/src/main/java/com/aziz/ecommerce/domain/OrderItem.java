package com.aziz.ecommerce.domain;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_order_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "t_products_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "t_orders_id")
    private Order order;

}
