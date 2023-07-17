package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryDao extends JpaRepository<Country, Long> {
}
