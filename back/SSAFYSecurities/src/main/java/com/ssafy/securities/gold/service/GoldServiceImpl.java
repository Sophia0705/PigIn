package com.ssafy.securities.gold.service;

import org.springframework.beans.factory.annotation.Value;

public class GoldServiceImpl implements GoldService {

    @Value("${gold.APIKEY}")
    private String APIKEY;

    @Override
    public void saveGold() {

    }
}
