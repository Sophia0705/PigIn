package com.ssafy.c203.domain.gold.dto;

import lombok.Data;

@Data
public class GoldAutoSetting {
    private String gold;
    private String goldName;
    private Integer percent;

    public GoldAutoSetting() {
        this.gold = "gold";
        this.goldName = "순금 1kg";
    }

    public GoldAutoSetting(Integer percent) {
        this.gold = "gold";
        this.goldName = "순금 1kg";
        this.percent = percent;
    }
}