package com.ssafy.c203.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {

        //프론트 웹주소 넣어줄것
        corsRegistry.addMapping("/**")
            .allowedOrigins("http://localhost:3000");
    }
}
