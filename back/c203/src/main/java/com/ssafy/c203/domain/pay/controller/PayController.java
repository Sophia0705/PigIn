package com.ssafy.c203.domain.pay.controller;

import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/pay")
@RequiredArgsConstructor
@RestController
public class PayController {
    private final PayService payService;

    @PostMapping("/")
    public ResponseEntity<?> ssafyPay(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        payService.payMoney(userId);
        return ResponseEntity.ok("거래 완료!");
    }

}
