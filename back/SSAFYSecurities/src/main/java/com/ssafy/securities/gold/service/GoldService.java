package com.ssafy.securities.gold.service;

import com.ssafy.securities.gold.dto.response.GoldItemDto;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.ProtocolException;

public interface GoldService {
    GoldItemDto getGold() throws IOException;
    void saveGold(GoldItemDto gold);
    void saveAllGold() throws IOException;
    int getGoldPrice();
}
