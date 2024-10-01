package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.dto.response.GoldYearDto;
import java.util.List;

public interface GoldService {

    void goldTradeRequest(GoldTradeDto buyGoldDto, Long userId);

    List<GoldYearDto> goldYearList();

    List<GoldYearDto> goldDayList();
}
