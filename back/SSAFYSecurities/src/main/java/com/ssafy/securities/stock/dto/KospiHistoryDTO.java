package com.ssafy.securities.stock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KospiHistoryDTO {

    @JsonProperty("stck_bsop_date")
    private String tradingDate;

    @JsonProperty("bstp_nmix_prpr")
    private Double closingPrice;

    @JsonProperty("bstp_nmix_oprc")
    private Double openingPrice;

    @JsonProperty("bstp_nmix_hgpr")
    private Double highPrice;

    @JsonProperty("bstp_nmix_lwpr")
    private Double lowPrice;

    @JsonProperty("acml_vol")
    private Long accumulatedVolume;

    @JsonProperty("acml_tr_pbmn")
    private Long accumulatedTransactionAmount;

    @JsonProperty("mod_yn")
    private String modificationFlag;
}
