package com.ssafy.c203.domain.gold.service;

import com.ssafy.c203.domain.gold.dto.GoldAutoSetting;
import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.dto.response.FindGoldPortfolioResponse;
import com.ssafy.c203.domain.gold.dto.response.GoldDetailDto;
import com.ssafy.c203.domain.gold.dto.response.GoldDto;
import com.ssafy.c203.domain.gold.dto.response.GoldYearDto;
import java.util.List;

public interface GoldService {

    void goldTradeRequest(GoldTradeDto buyGoldDto, Long userId, boolean isAutoFund);

    List<GoldYearDto> goldYearList();

    List<GoldDto> goldDayList();

    List<GoldDto> goldMonthList();

    GoldDetailDto goldDetail();

    List<GoldDto> goldThreeMonthList();

    void addAutoFunding(Long userId);

    void cancelAutoFunding(Long userId);

    void setAutoFundingRate(Long userId, int rate);

    void favoriteGold(Long userId);

    void cancelFavoriteGold(Long userId);

    boolean isFavoriteGold(Long userId);

    boolean isAutoFundingGold(Long userId);

    double getMine(Long userId);

    FindGoldPortfolioResponse findPortfolio(Long userId);

    void setAutoFunding(Long userId, int percent);

    List<GoldAutoSetting> findAutoSetting(Long userId);
}
