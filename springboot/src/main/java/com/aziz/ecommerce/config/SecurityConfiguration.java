package com.aziz.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfiguration {
    private final String [] whiteList =
            {
                    "/products/**",
                    "/product-category/**",
                    "/swagger-ui/**", "/v3/api-docs/**",
                    "/swagger-ui.html"
            };
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.authorizeHttpRequests(configurer ->
                        configurer
                                .requestMatchers(whiteList)
                                .permitAll()
                                .anyRequest()
                                .authenticated())
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt(Customizer.withDefaults()));

        // add CORS filters
        http.cors(Customizer.withDefaults());

        // disable CSRF since we are not using Cookies for session tracking
        http.csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }
}
