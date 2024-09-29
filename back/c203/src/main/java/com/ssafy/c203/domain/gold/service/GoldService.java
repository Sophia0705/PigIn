package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.request.BuyGoldDto;

public interface GoldService {

    void buyGoldInTime(BuyGoldDto buyGoldDto, Long userId);
    void buyGoldOutTime(BuyGoldDto buyGoldDto, Long userId);
    void sellGoldInTime(BuyGoldDto buyGoldDto, Long userId);
}
