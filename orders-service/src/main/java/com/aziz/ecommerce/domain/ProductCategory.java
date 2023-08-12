package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "t_products_categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    /* productCategory field in the Product class establishes the association with this class.*/
    @OneToMany(mappedBy = "productCategory", cascade = CascadeType.ALL)
    /* Referencing the child table */
    Set<Product> products;
}
