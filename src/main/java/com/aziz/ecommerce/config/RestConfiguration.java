package com.aziz.ecommerce.config;

import com.aziz.ecommerce.domain.Product;
import com.aziz.ecommerce.domain.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;
import java.util.Set;

@Configuration
public class RestConfiguration implements RepositoryRestConfigurer {
    private EntityManager entityManager;
    @Autowired
    public RestConfiguration(EntityManager entityManager){
        this.entityManager = entityManager;
    }

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
        exposeIds(config);

    }

    /**
     * Expose entities' IDs.
     * @param config REST configuration.
     */
    private void exposeIds(RepositoryRestConfiguration config) {
        //get entity classes.
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        //get java type of each of them.
        List<? extends Class<?>> entityClasses = entities.stream().map(Type::getJavaType).toList();
        //expose the ID of each entity.
        config.exposeIdsFor(entityClasses.toArray(new Class[0]));

    }
}
