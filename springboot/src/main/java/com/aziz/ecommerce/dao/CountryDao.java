package com.aziz.ecommerce.dao;

import com.aziz.ecommerce.domain.City;
import com.aziz.ecommerce.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryDao extends JpaRepository<Country, Long> {
}
