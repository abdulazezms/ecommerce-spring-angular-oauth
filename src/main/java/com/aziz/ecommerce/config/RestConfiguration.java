package com.aziz.ecommerce.config;

import com.aziz.ecommerce.domain.Product;
import com.aziz.ecommerce.domain.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestConfiguration implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedHttpMethods = {HttpMethod.PATCH, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.POST};
        config
                .getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)));

        config
                .getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)));

    }
}
