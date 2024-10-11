package com.ssafy.c203;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class C203Application {

	public static void main(String[] args) {
		SpringApplication.run(C203Application.class, args);
	}

}
