package com.ssafy.c203.healthcheck;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/health-check")
public class HealthCheckController {

    @GetMapping
    public ResponseEntity<String> healthCheck() {
        log.info("Main Health Check!!");
        return ResponseEntity.ok("Main Pong!!");
    }
}
