package com.ssafy.securities.gold.service;

import com.ssafy.securities.gold.dto.response.GoldItemDto;
import com.ssafy.securities.gold.dto.response.GoldYearDto;
import com.ssafy.securities.gold.entity.Gold;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.util.List;

public interface GoldService {

    GoldItemDto getGold() throws IOException;

    void saveGold(GoldItemDto gold);

    void saveAllGold() throws IOException;

    int getGoldPrice();

    List<GoldYearDto> getGoldList();
    List<GoldYearDto> getGoldDaysList();
    List<GoldYearDto> getGoldMonthsList();
}
