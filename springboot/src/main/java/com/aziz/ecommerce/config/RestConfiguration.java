package com.aziz.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class RestConfiguration implements WebMvcConfigurer {
    @Value("${server.servlet.context-path}")
    private String basePath;

    @Value("${env.allowed.origins}")
    private String [] allowedOrigins;

    /**
     * Allow all requests from origins defined in the `allowedOrigins` env variable.
     * The path pattern passed to the addMapping(pathPattern) is relative to the context path.
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(allowedOrigins);
    }
}
