package com.ssafy.c203.domain.coin.dto;

import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinAutoSetting {
    private String coinCode;
    private String coinName;
    private Integer percent;

    public CoinAutoSetting (CoinAutoFunding coinAutoFunding) {
        this.coinCode = coinAutoFunding.getCoinItem().getId();
        this.coinName = coinAutoFunding.getCoinItem().getName();
        this.percent = coinAutoFunding.getRate();

    }
}
