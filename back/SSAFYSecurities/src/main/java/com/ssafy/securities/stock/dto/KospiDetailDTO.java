package com.ssafy.securities.stock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class KospiDetailDTO {

    @JsonProperty("bstp_nmix_prdy_vrss")
    private Double changePrice;

    @JsonProperty("prdy_vrss_sign")
    private String priceMoveSign;

    @JsonProperty("bstp_nmix_prdy_ctrt")
    private Double changeRate;

    @JsonProperty("prdy_nmix")
    private Double previousDayIndex;

    @JsonProperty("acml_vol")
    private Long accumulatedVolume;

    @JsonProperty("acml_tr_pbmn")
    private Long accumulatedTransactionAmount;

    @JsonProperty("hts_kor_isnm")
    private String koreanName;

    @JsonProperty("bstp_nmix_prpr")
    private Double currentPrice;

    @JsonProperty("bstp_cls_code")
    private String marketCode;

    @JsonProperty("prdy_vol")
    private Long previousDayVolume;

    @JsonProperty("bstp_nmix_oprc")
    private Double openPrice;

    @JsonProperty("bstp_nmix_hgpr")
    private Double highPrice;

    @JsonProperty("bstp_nmix_lwpr")
    private Double lowPrice;

    @JsonProperty("futs_prdy_oprc")
    private Double futuresOpenPrice;

    @JsonProperty("futs_prdy_hgpr")
    private Double futuresHighPrice;

    @JsonProperty("futs_prdy_lwpr")
    private Double futuresLowPrice;

}
