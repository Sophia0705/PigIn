package com.ssafy.securities.gold.controller;

import com.ssafy.securities.gold.dto.response.GoldItemDto;
import com.ssafy.securities.gold.service.GoldService;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/gold")
public class GoldController {

    private final GoldService goldService;

    @GetMapping("/get-today")
    public ResponseEntity<?> getToday() throws IOException {
        GoldItemDto goldItemDto = goldService.getGold();
        return ResponseEntity.ok(goldItemDto);
    }

    @GetMapping("/save-today-gold")
    public ResponseEntity<?> saveTodayGold() throws IOException {
        goldService.saveGold(goldService.getGold());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/save-before-gold")
    public ResponseEntity<?> saveBeforeGold() throws IOException {
        goldService.saveAllGold();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-today-price")
    public ResponseEntity<?> getTodayPrice() throws IOException {
        return ResponseEntity.ok(goldService.getGoldPrice());
    }

    @GetMapping("/years")
    public ResponseEntity<?> getGold() throws IOException {
        return ResponseEntity.ok(goldService.getGoldList());
    }

    @GetMapping("/weeks")
    public ResponseEntity<?> getGoldWeeks(){
        return ResponseEntity.ok(goldService.getGoldDaysList());
    }

    @GetMapping("/months")
    public ResponseEntity<?> getGoldMonths(){
        return ResponseEntity.ok(goldService.getGoldMonthsList());
    }
}
