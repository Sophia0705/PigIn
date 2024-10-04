package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.dto.response.GoldDetailDto;
import com.ssafy.c203.domain.gold.dto.response.GoldDto;
import com.ssafy.c203.domain.gold.dto.response.GoldYearDto;
import java.util.List;

public interface GoldService {

    void goldTradeRequest(GoldTradeDto buyGoldDto, Long userId);

    List<GoldYearDto> goldYearList();

    List<GoldDto> goldDayList();

    List<GoldDto> goldMonthList();

    GoldDetailDto goldDetail();

    List<GoldDto> goldThreeMonthList();

    void addAutoFunding(Long userId);

    void cancelAutoFunding(Long userId);

    void setAutoFundingRate(Long userId, int rate);

    void favoriteGold(Long userId);
}
