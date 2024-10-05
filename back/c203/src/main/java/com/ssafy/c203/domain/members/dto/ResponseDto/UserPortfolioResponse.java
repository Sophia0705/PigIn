package com.ssafy.c203.domain.members.dto.ResponseDto;

import com.ssafy.c203.domain.coin.dto.response.FindCoinPortfolioResponse;
import com.ssafy.c203.domain.gold.dto.response.FindGoldPortfolioResponse;
import com.ssafy.c203.domain.stock.dto.response.FindStockPortfolioResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserPortfolioResponse {
    private Double stockPrice;
    private Double cryptoPrice;
    private Double goldPrice;
    private Double totalPrice;

    private List<FindStockPortfolioResponse> stocks;
    private List<FindCoinPortfolioResponse> cryptocurrencies;
    private List<FindGoldPortfolioResponse> gold;
}
