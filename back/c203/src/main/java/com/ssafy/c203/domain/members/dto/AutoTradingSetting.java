package com.ssafy.c203.domain.members.dto;

import com.ssafy.c203.domain.coin.dto.CoinAutoSetting;
import com.ssafy.c203.domain.gold.dto.GoldAutoSetting;
import com.ssafy.c203.domain.stock.dto.StockAutoSetting;
import lombok.Data;

import java.util.List;

@Data
public class AutoTradingSetting {
    private Boolean isEnabled;
    private Integer investmentAmount;

    private List<StockAutoSetting> stocks;
    private List<CoinAutoSetting> coins;
    private List<GoldAutoSetting> golds;
}
