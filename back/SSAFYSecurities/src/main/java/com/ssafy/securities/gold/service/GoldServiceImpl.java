package com.ssafy.securities.gold.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoldServiceImpl implements GoldService {

    @Value("${gold.APIKEY}")
    private String APIKEY;

    @Override
    public void saveGold() {

    }
}
