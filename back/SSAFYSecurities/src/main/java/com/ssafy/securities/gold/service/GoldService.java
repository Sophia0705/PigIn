package com.ssafy.securities.gold.service;

import com.ssafy.securities.gold.dto.response.GoldItemDto;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;

public interface GoldService {
    GoldItemDto getGold() throws IOException;
    void saveGold(GoldItemDto gold) throws IOException;
}
