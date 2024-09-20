package com.ssafy.securities.stock.dto.apiResponse.apiResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.securities.stock.dto.StockBarDTO;
import com.ssafy.securities.stock.dto.StockDetailsDTO;
import lombok.Data;

import java.util.List;

@Data
public class StockResponse {

    @JsonProperty("output1")
    private StockDetailsDTO stockDetails;              // output1 데이터 (StockDetailsDTO 타입)
    @JsonProperty("output2")
    private List<StockBarDTO> stockBar;     // output2 리스트 (StockDailyPriceDTO 타입)
    @JsonProperty("rt_cd")
    private String rtCd;                          // 응답 코드
    @JsonProperty("msg_cd")
    private String msgCd;                         // 메시지 코드
    private String msg1;

}
