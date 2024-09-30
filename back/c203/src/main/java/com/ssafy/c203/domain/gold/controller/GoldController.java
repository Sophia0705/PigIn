package com.ssafy.c203.domain.gold.controller;

import com.ssafy.c203.domain.gold.dto.request.BuyGoldDto;
import com.ssafy.c203.domain.gold.service.GoldService;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/gold")
public class GoldController {

    private final GoldService goldService;


    @PostMapping("/buy")
    public ResponseEntity<?> buyGold(@RequestBody BuyGoldDto buyGoldDto, @AuthenticationPrincipal
    CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        goldService.buyGoldRequest(buyGoldDto, userId);
        return ResponseEntity.ok("거래 완료");
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellGold(@RequestBody BuyGoldDto buyGoldDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        Long userId = customUserDetails.getUserId();
        goldService.sellGoldInTime(buyGoldDto, userId);

        return ResponseEntity.ok("판매완료");
    }

}
