package com.ssafy.securities.stock.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class StockDetailsDTO {
    @JsonProperty("prdy_vrss")
    private String prdyVrss;           // 전일 대비 가격 변동

    @JsonProperty("prdy_vrss_sign")
    private String prdyVrssSign;       // 전일 대비 가격 변동 부호

    @JsonProperty("prdy_ctrt")
    private String prdyCtrt;           // 전일 대비 변동률

    @JsonProperty("stck_prdy_clpr")
    private String stckPrdyClpr;       // 전일 종가

    @JsonProperty("acml_vol")
    private String acmlVol;            // 누적 거래량

    @JsonProperty("acml_tr_pbmn")
    private String acmlTrPbmn;         // 누적 거래대금

    @JsonProperty("hts_kor_isnm")
    private String htsKorIsnm;         // 종목명 (한글)

    @JsonProperty("stck_prpr")
    private String stckPrpr;           // 현재가

    @JsonProperty("stck_shrn_iscd")
    private String stckShrnIscd;       // 종목코드

    @JsonProperty("prdy_vol")
    private String prdyVol;            // 전일 거래량

    @JsonProperty("stck_mxpr")
    private String stckMxpr;           // 최고가

    @JsonProperty("stck_llam")
    private String stckLlam;           // 최저가

    @JsonProperty("stck_oprc")
    private String stckOprc;           // 시가

    @JsonProperty("stck_hgpr")
    private String stckHgpr;           // 고가

    @JsonProperty("stck_lwpr")
    private String stckLwpr;           // 저가

    @JsonProperty("stck_prdy_oprc")
    private String stckPrdyOprc;       // 전일 시가

    @JsonProperty("stck_prdy_hgpr")
    private String stckPrdyHgpr;       // 전일 고가

    @JsonProperty("stck_prdy_lwpr")
    private String stckPrdyLwpr;       // 전일 저가

    @JsonProperty("askp")
    private String askp;               // 매도 호가

    @JsonProperty("bidp")
    private String bidp;               // 매수 호가

    @JsonProperty("prdy_vrss_vol")
    private String prdyVrssVol;        // 전일 대비 거래량 변동

    @JsonProperty("vol_tnrt")
    private String volTnrt;            // 거래 회전율

    @JsonProperty("stck_fcam")
    private String stckFcam;           // 액면가

    @JsonProperty("lstn_stcn")
    private String lstnStcn;           // 상장 주식 수

    @JsonProperty("cpfn")
    private String cpfn;               // 시가총액

    @JsonProperty("hts_avls")
    private String htsAvls;            // 시가총액 (원)

    @JsonProperty("per")
    private String per;                // PER

    @JsonProperty("eps")
    private String eps;                // EPS

    @JsonProperty("pbr")
    private String pbr;                // PBR

    @JsonProperty("itewhol_loan_rmnd_ratem")
    private String itewholLoanRmndRate; // 대차잔고 비율
}
