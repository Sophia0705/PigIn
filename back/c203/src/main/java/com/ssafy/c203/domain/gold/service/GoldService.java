package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;

public interface GoldService {

    void goldTradeRequest(GoldTradeDto buyGoldDto, Long userId);
}
