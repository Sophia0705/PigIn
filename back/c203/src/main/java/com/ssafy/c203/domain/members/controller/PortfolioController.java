package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.members.dto.AutoTradingSetting;
import com.ssafy.c203.domain.members.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/portfolio")
    public ResponseEntity<?> findUserPortfolio(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok().body(portfolioService.findPortfolio(userId));
    }

    @PostMapping("/auto-funding")
    public ResponseEntity<?> setAutoFunding(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                            @RequestBody AutoTradingSetting request) {
        log.info("setAutoFunding {}", request);

        Long userId = customUserDetails.getUserId();
        portfolioService.updateAutoTrading(userId, request.getIsEnabled(), request.getInvestmentAmount());
        portfolioService.updateCoinAutoTrading(userId, request.getCoins());
        portfolioService.updateStockAutoTrading(userId, request.getStocks());
        if (request.getGolds().isEmpty()) {
            portfolioService.updateGoldAutoTrading(userId, 0);
        } else {
            portfolioService.updateGoldAutoTrading(userId, request.getGolds().get(0).getPercent());
        }

        return ResponseEntity.ok().body(makeResult("result", true));
    }

    @GetMapping("/auto-funding")
    public ResponseEntity<?> getAutoFunding(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        return ResponseEntity.ok().body(portfolioService.findAutoTrading(userId));
    }

    private Map<String, Boolean> makeResult(String key, Boolean value) {
        Map<String, Boolean> result = new HashMap<>();
        result.put(key, value);
        return result;
    }

}
