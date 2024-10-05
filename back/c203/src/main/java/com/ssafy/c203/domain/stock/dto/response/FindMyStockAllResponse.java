package com.ssafy.c203.domain.stock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FindMyStockAllResponse {
    private Double stockPrice;
    private List<FindStockPortfolioResponse> stocks;
}
