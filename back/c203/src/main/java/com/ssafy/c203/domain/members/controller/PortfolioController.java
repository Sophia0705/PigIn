package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.members.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping()
    public ResponseEntity<?> findUserPortfolio(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok().body(portfolioService.findPortfolio(userId));
    }
}
