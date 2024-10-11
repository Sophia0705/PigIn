package com.ssafy.c203.domain.coin.dto.response;

import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FindMyCoinAllResponse {
    private Double cryptoPrice;
    private List<FindCoinPortfolioResponse> cryptocurrencies;
}
