package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.request.BuyGoldDto;

public interface GoldService {

    void buyGoldRequest(BuyGoldDto buyGoldDto, Long userId);
    void sellGoldInTime(BuyGoldDto buyGoldDto, Long userId);
}
