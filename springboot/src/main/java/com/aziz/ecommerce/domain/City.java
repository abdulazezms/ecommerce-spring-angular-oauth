package com.aziz.ecommerce.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_cities")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @JoinColumn(name = "t_countries_id", nullable = false)
    @ManyToOne
    /* Referencing the parent table. */
    private Country country;
}
