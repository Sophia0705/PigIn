package com.ssafy.c203.domain.stock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FindStockNowResponse {
    private boolean isLive;
    private FindStockChartAllResponse data;
}
