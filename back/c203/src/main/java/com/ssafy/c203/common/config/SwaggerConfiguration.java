package com.ssafy.c203.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI openAPI() {
        Info info = new Info().title("PigIn API 명세서").description(
            "<h3>PigIn API Reference for Developers</h3> 특화 프로젝트 PigIn API <br>"
        ).version("v1").contact(new io.swagger.v3.oas.models.info.Contact().name(
                "최승현, \t\n" + "B중현, \t\n" + "남혁준, \t\n" + "최승필, \t\n" + "김태연, \t\n" + "이예지")
            .email("csh7099@naver.com"));

        return new OpenAPI().components(new Components()).info(info);
    }

    @Bean
    public GroupedOpenApi allApi() {
        return GroupedOpenApi.builder().group("PigIn-ALL").pathsToMatch("/**").build();
    }

    @Bean
    public GroupedOpenApi memberApi() {
        return GroupedOpenApi.builder().group("PigIn-MEMBER").pathsToMatch("/member/**")
            .build();
    }
}
