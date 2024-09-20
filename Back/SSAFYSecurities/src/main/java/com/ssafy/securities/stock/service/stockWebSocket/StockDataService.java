package com.ssafy.securities.stock.service.stockWebSocket;

import com.ssafy.securities.stock.dto.StockBarDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class StockDataService {

//    private final StockBarRepository stockBarRepository;

//    public StockDataService(StockBarRepository stockBarRepository) {
//        this.stockBarRepository = stockBarRepository;
//    }
//
//    @Transactional
//    public void saveStockData(String stockCode, StockBarDTO stockData) {
//        StockBarEntity entity = convertToEntity(stockCode, stockData);
//        stockBarRepository.save(entity);
//    }
//
//    private StockBarEntity convertToEntity(String stockCode, StockBarDTO dto) {
//        // DTO를 엔티티로 변환하는 로직 구현
//        return new StockBarEntity(); // 임시 반환
//    }

    public void saveStockData(String stockCode, StockBarDTO stockData) {
        log.info("saved: [stockCode:{}, stockData:{}]", stockCode, stockData);
    }
}