package com.ssafy.c203.domain.stock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.c203.domain.stock.entity.mongo.MongoStockDetail;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FindStockDetailResponse {
    @JsonProperty("prdy_vrss")
    private String prdyVrss;

    @JsonProperty("prdy_vrss_sign")
    private String prdyVrssSign;

    @JsonProperty("prdy_ctrt")
    private String prdyCtrt;

    @JsonProperty("stck_prdy_clpr")
    private String stckPrdyClpr;

    @JsonProperty("acml_vol")
    private String acmlVol;

    @JsonProperty("acml_tr_pbmn")
    private String acmlTrPbmn;

    @JsonProperty("hts_kor_isnm")
    private String htsKorIsnm;

    @JsonProperty("stck_prpr")
    private String stckPrpr;

    @JsonProperty("stck_shrn_iscd")
    private String stckShrnIscd;

    @JsonProperty("prdy_vol")
    private String prdyVol;

    @JsonProperty("stck_mxpr")
    private String stckMxpr;

    @JsonProperty("stck_llam")
    private String stckLlam;

    @JsonProperty("stck_oprc")
    private String stckOprc;

    @JsonProperty("stck_hgpr")
    private String stckHgpr;

    @JsonProperty("stck_lwpr")
    private String stckLwpr;

    @JsonProperty("stck_prdy_oprc")
    private String stckPrdyOprc;

    @JsonProperty("stck_prdy_hgpr")
    private String stckPrdyHgpr;

    @JsonProperty("stck_prdy_lwpr")
    private String stckPrdyLwpr;

    @JsonProperty("askp")
    private String askp;

    @JsonProperty("bidp")
    private String bidp;

    @JsonProperty("prdy_vrss_vol")
    private String prdyVrssVol;

    @JsonProperty("vol_tnrt")
    private String volTnrt;

    @JsonProperty("stck_fcam")
    private String stckFcam;

    @JsonProperty("lstn_stcn")
    private String lstnStcn;

    @JsonProperty("cpfn")
    private String cpfn;

    @JsonProperty("hts_avls")
    private String htsAvls;

    @JsonProperty("per")
    private String per;

    @JsonProperty("eps")
    private String eps;

    @JsonProperty("pbr")
    private String pbr;

    @JsonProperty("itewhol_loan_rmnd_rate")
    private String itewholLoanRmndRate;

    @JsonProperty("stck_bsop_date")
    private LocalDate stckBsopDate;

    // MongoStockDetail 엔티티를 받아서 DTO로 변환하는 생성자
    public FindStockDetailResponse(MongoStockDetail entity) {
        this.prdyVrss = entity.getPrdyVrss();
        this.prdyVrssSign = entity.getPrdyVrssSign();
        this.prdyCtrt = entity.getPrdyCtrt();
        this.stckPrdyClpr = entity.getStckPrdyClpr();
        this.acmlVol = entity.getAcmlVol();
        this.acmlTrPbmn = entity.getAcmlTrPbmn();
        this.htsKorIsnm = entity.getHtsKorIsnm();
        this.stckPrpr = entity.getStckPrpr();
        this.stckShrnIscd = entity.getStckShrnIscd();
        this.prdyVol = entity.getPrdyVol();
        this.stckMxpr = entity.getStckMxpr();
        this.stckLlam = entity.getStckLlam();
        this.stckOprc = entity.getStckOprc();
        this.stckHgpr = entity.getStckHgpr();
        this.stckLwpr = entity.getStckLwpr();
        this.stckPrdyOprc = entity.getStckPrdyOprc();
        this.stckPrdyHgpr = entity.getStckPrdyHgpr();
        this.stckPrdyLwpr = entity.getStckPrdyLwpr();
        this.askp = entity.getAskp();
        this.bidp = entity.getBidp();
        this.prdyVrssVol = entity.getPrdyVrssVol();
        this.volTnrt = entity.getVolTnrt();
        this.stckFcam = entity.getStckFcam();
        this.lstnStcn = entity.getLstnStcn();
        this.cpfn = entity.getCpfn();
        this.htsAvls = entity.getHtsAvls();
        this.per = entity.getPer();
        this.eps = entity.getEps();
        this.pbr = entity.getPbr();
        this.itewholLoanRmndRate = entity.getItewholLoanRmndRate();
        this.stckBsopDate = entity.getStckBsopDate();
    }
}

