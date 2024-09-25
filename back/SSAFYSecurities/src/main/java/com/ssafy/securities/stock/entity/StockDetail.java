package com.ssafy.securities.stock.entity;

import com.ssafy.securities.stock.dto.StockDetailsDTO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Document(collection = "stockDetail")
public class StockDetail {
    @Id
    private String id;

    // 전일 대비 가격 변동
    private String prdyVrss;

    // 전일 대비 가격 변동 부호
    private String prdyVrssSign;

    // 전일 대비 변동률
    private String prdyCtrt;

    // 전일 종가
    private String stckPrdyClpr;

    // 누적 거래량
    private String acmlVol;

    // 누적 거래대금
    private String acmlTrPbmn;

    // 종목명 (한글)
    private String htsKorIsnm;

    // 현재가 (종가)
    private String stckPrpr;

    // 종목코드
    private String stckShrnIscd;

    // 전일 거래량
    private String prdyVol;

    // 최고가
    private String stckMxpr;

    // 최저가
    private String stckLlam;

    // 시가
    private String stckOprc;

    // 고가
    private String stckHgpr;

    // 저가
    private String stckLwpr;

    // 전일 시가
    private String stckPrdyOprc;

    // 전일 고가
    private String stckPrdyHgpr;

    // 전일 저가
    private String stckPrdyLwpr;

    // 매도 호가
    private String askp;

    // 매수 호가
    private String bidp;

    // 전일 대비 거래량 변동
    private String prdyVrssVol;

    // 거래 회전율
    private String volTnrt;

    // 액면가
    private String stckFcam;

    // 상장 주식 수
    private String lstnStcn;

    // 시가총액
    private String cpfn;

    // 시가총액 (원)
    private String htsAvls;

    // PER (Price to Earnings Ratio)
    private String per;

    // EPS (Earnings Per Share)
    private String eps;

    // PBR (Price to Book Ratio)
    private String pbr;

    // 대차잔고 비율
    private String itewholLoanRmndRate;

    // 주식 영업일
    private LocalDate stckBsopDate;

    public StockDetail(StockDetailsDTO dto) {
        this.prdyVrss = dto.getPrdyVrss();
        this.prdyVrssSign = dto.getPrdyVrssSign();
        this.prdyCtrt = dto.getPrdyCtrt();
        this.stckPrdyClpr = dto.getStckPrdyClpr();
        this.acmlVol = dto.getAcmlVol();
        this.acmlTrPbmn = dto.getAcmlTrPbmn();
        this.htsKorIsnm = dto.getHtsKorIsnm();
        this.stckPrpr = dto.getStckPrpr();
        this.stckShrnIscd = dto.getStckShrnIscd();
        this.prdyVol = dto.getPrdyVol();
        this.stckMxpr = dto.getStckMxpr();
        this.stckLlam = dto.getStckLlam();
        this.stckOprc = dto.getStckOprc();
        this.stckHgpr = dto.getStckHgpr();
        this.stckLwpr = dto.getStckLwpr();
        this.stckPrdyOprc = dto.getStckPrdyOprc();
        this.stckPrdyHgpr = dto.getStckPrdyHgpr();
        this.stckPrdyLwpr = dto.getStckPrdyLwpr();
        this.askp = dto.getAskp();
        this.bidp = dto.getBidp();
        this.prdyVrssVol = dto.getPrdyVrssVol();
        this.volTnrt = dto.getVolTnrt();
        this.stckFcam = dto.getStckFcam();
        this.lstnStcn = dto.getLstnStcn();
        this.cpfn = dto.getCpfn();
        this.htsAvls = dto.getHtsAvls();
        this.per = dto.getPer();
        this.eps = dto.getEps();
        this.pbr = dto.getPbr();
        this.itewholLoanRmndRate = dto.getItewholLoanRmndRate();
        this.stckBsopDate = dto.getStckBsopDate();
    }
}