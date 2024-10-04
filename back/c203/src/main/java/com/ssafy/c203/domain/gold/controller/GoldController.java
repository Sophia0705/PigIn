package com.ssafy.c203.domain.gold.controller;

import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.service.GoldService;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/gold")
public class GoldController {

    private final GoldService goldService;


    @PostMapping("/trade")
    public ResponseEntity<?> tradeGold(@RequestBody GoldTradeDto buyGoldDto,
        @AuthenticationPrincipal
        CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        goldService.goldTradeRequest(buyGoldDto, userId);
        return ResponseEntity.ok("거래 완료");
    }

    @GetMapping("/gold-year")
    public ResponseEntity<?> getYearGold() {
        return ResponseEntity.ok(goldService.goldYearList());
    }

    @GetMapping("/gold-week")
    public ResponseEntity<?> getWeekGold() {
        return ResponseEntity.ok(goldService.goldDayList());
    }

    @GetMapping("/gold-month")
    public ResponseEntity<?> getMonthGold() {
        return ResponseEntity.ok(goldService.goldMonthList());
    }

    @GetMapping("/gold-three-month")
    public ResponseEntity<?> getThreeMonthGold() {
        return ResponseEntity.ok(goldService.goldThreeMonthList());
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getDetailGold() {
        return ResponseEntity.ok(goldService.goldDetail());
    }

    @GetMapping("/auto-funding-add")
    public ResponseEntity<?> addAutoFundingGold(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        goldService.addAutoFunding(userId);
        return ResponseEntity.ok("자동투자 등록 성공");
    }

    @GetMapping("/auto-funding-cancel")
    public ResponseEntity<?> cancelAutoFunding(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        goldService.cancelAutoFunding(userId);
        return ResponseEntity.ok("자동투자 삭제 완료");
    }

    @GetMapping("/auto-funding-setrate")
    public ResponseEntity<?> setAutoFundingRate(
        @AuthenticationPrincipal CustomUserDetails customUserDetails,
        @RequestParam("rate") int rate) {
        Long userId = customUserDetails.getUserId();
        goldService.setAutoFundingRate(userId, rate);
        return ResponseEntity.ok("자동투자 비율 설정 완료");
    }

    @GetMapping("/favorite")
    public ResponseEntity<?> getFavoriteGold(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        goldService.favoriteGold(userId);
        return ResponseEntity.ok("금 찜하기 성공");
    }
    
}
