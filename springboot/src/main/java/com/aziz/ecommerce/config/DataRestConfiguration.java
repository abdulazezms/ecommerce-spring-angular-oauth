package com.aziz.ecommerce.config;

import com.aziz.ecommerce.domain.City;
import com.aziz.ecommerce.domain.Country;
import com.aziz.ecommerce.domain.Product;
import com.aziz.ecommerce.domain.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfiguration implements RepositoryRestConfigurer {
    @Value("${env.allowed.origins}")
    private String [] allowedOrigins;
    private EntityManager entityManager;

    @Value("${server.servlet.context-path}")
    private String basePath;

    @Autowired
    public DataRestConfiguration(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedHttpMethods = {HttpMethod.PATCH, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.POST};
        disableHttpMethods(unsupportedHttpMethods, config, Product.class);
        disableHttpMethods(unsupportedHttpMethods, config, ProductCategory.class);
        disableHttpMethods(unsupportedHttpMethods, config, Country.class);
        disableHttpMethods(unsupportedHttpMethods, config, City.class);
        exposeIds(config);
        System.out.println("adding mapping to " + basePath + "/** => " + Arrays.toString(allowedOrigins));
        cors.addMapping("/**").allowedOrigins(allowedOrigins);
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

    private void disableHttpMethods(HttpMethod[] unsupportedHttpMethods, RepositoryRestConfiguration config, Class<?> c){
        config
                .getExposureConfiguration()
                .forDomainType(c)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedHttpMethods)));
    }
}
