package com.ssafy.securities.coin.service.coinWebSocket;

import com.ssafy.securities.coin.dto.CoinMinuteDTO;
import com.ssafy.securities.coin.dto.CoinWebSocketBarDTO;
import com.ssafy.securities.coin.entity.CoinMinute;
import com.ssafy.securities.coin.repository.CoinMinuteRepository;
import com.ssafy.securities.stock.dto.StockDTO;
import com.ssafy.securities.stock.entity.StockMinute;
import com.ssafy.securities.stock.repository.StockMinuteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class CoinDataService {

    private final CoinMinuteRepository coinMinuteRepository;

    public void saveCoinData(CoinMinuteDTO coinMinuteDTO) {

        CoinMinute coinMinute = new CoinMinute(coinMinuteDTO);
        coinMinuteRepository.save(coinMinute);
    }
}