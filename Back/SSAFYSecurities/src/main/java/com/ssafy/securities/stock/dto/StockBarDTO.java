package com.ssafy.securities.stock.dto;

import lombok.Builder;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Builder
@Data
public class StockBarDTO {
    @JsonProperty("stck_bsop_date")
    private String stckBsopDate;       // 영업일

    @JsonProperty("stck_clpr")
    private String stckClpr;           // 종가

    @JsonProperty("stck_oprc")
    private String stckOprc;           // 시가

    @JsonProperty("stck_hgpr")
    private String stckHgpr;           // 고가

    @JsonProperty("stck_lwpr")
    private String stckLwpr;           // 저가

    @JsonProperty("acml_vol")
    private String acmlVol;            // 누적 거래량

    @JsonProperty("acml_tr_pbmn")
    private String acmlTrPbmn;         // 누적 거래대금

    @JsonProperty("flng_cls_code")
    private String flngClsCode;        // 종가 코드

    @JsonProperty("prtt_rate")
    private String prttRate;           // 배당률

    @JsonProperty("mod_yn")
    private String modYn;              // 수정 여부

    @JsonProperty("prdy_vrss_sign")
    private String prdyVrssSign;       // 전일 대비 가격 변동 부호

    @JsonProperty("prdy_vrss")
    private String prdyVrss;           // 전일 대비 가격 변동

    @JsonProperty("revl_issu_reas")
    private String revlIssuReas;       // 공시 사유
}