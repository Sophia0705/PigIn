package com.ssafy.securities.gold.dto.response;

import lombok.Data;

@Data
public class GoldParsingDto {
    private String basDt;       // 기준 날짜
    private String srtnCd;      // 단축 코드
    private String isinCd;      // ISIN 코드
    private String itmsNm;      // 종목명
    private int clpr;           // 종가
    private String vs;          // 전일 대비
    private String fltRt;       // 등락률
    private int mkp;            // 시가
    private int hipr;           // 고가
    private int lopr;           // 저가
    private String trqu;        // 거래량
    private String trPrc;       // 거래대금
}
