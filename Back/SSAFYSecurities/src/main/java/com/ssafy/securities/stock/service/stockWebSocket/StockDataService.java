package com.ssafy.securities.stock.service.stockWebSocket;

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
public class StockDataService {

    private final StockMinuteRepository stockMinuteRepository;

    public void saveStockData(StockDTO stockData) {
        StockMinute stockMinute = new StockMinute(stockData);
        stockMinuteRepository.save(stockMinute);
        log.info("saved: stockData:[{}]", stockData);
    }
}