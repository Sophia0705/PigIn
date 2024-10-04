package com.ssafy.securities;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SsafySecuritiesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsafySecuritiesApplication.class, args);
    }
}
