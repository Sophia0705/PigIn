package com.ssafy.securities.gold.service;

import com.ssafy.securities.gold.dto.response.GoldItemDto;
import com.ssafy.securities.gold.dto.response.GoldDto;
import com.ssafy.securities.gold.dto.response.GoldYearDto;
import java.io.IOException;
import java.util.List;

public interface GoldService {

    GoldItemDto getGold() throws IOException;

    void saveGold(GoldItemDto gold);

    void saveAllGold() throws IOException;

    int getGoldPrice();

    List<GoldYearDto> getGoldList();

    List<GoldDto> getGoldDaysList();

    List<GoldDto> getGoldMonthsList();
}
