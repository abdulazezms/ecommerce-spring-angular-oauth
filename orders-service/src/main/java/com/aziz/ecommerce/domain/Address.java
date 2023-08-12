package com.aziz.ecommerce.domain;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "t_addresses")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
    //the foreign key and the primary key are used to make the association.
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "t_cities_id")
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "t_countries_id")
    private Country country;

    @Column(name = "street")
    private String street;

    @Column(name = "zip_code")
    private String zipCode;

}
