package com.ssafy.securities.stock.dto.apiResponse.apiResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class StockDataDTO {

    @JsonProperty("acml_tr_pbmn")
    private String accumulatedTradingVolume;

    @JsonProperty("acml_vol")
    private String accumulatedVolume;

    @JsonProperty("flng_cls_code")
    private String fluctuationClassCode;

    @JsonProperty("mod_yn")
    private String modifiedYN;

    @JsonProperty("prdy_vrss")
    private String previousDayVersus;

    @JsonProperty("prdy_vrss_sign")
    private String previousDayVersusSign;

    @JsonProperty("prtt_rate")
    private String fluctuationRate;

    @JsonProperty("revl_issu_reas")
    private String revelationIssueReason;

    @JsonProperty("stck_bsop_date")
    private String stockBusinessDate;

    @JsonProperty("stck_clpr")
    private String stockClosingPrice;

    @JsonProperty("stck_hgpr")
    private String stockHighPrice;

    @JsonProperty("stck_lwpr")
    private String stockLowPrice;

    @JsonProperty("stck_oprc")
    private String stockOpeningPrice;

    // Getters and setters
    public String getAccumulatedTradingVolume() {
        return accumulatedTradingVolume;
    }

    public void setAccumulatedTradingVolume(String accumulatedTradingVolume) {
        this.accumulatedTradingVolume = accumulatedTradingVolume;
    }

    public String getAccumulatedVolume() {
        return accumulatedVolume;
    }

    public void setAccumulatedVolume(String accumulatedVolume) {
        this.accumulatedVolume = accumulatedVolume;
    }

    public String getFluctuationClassCode() {
        return fluctuationClassCode;
    }

    public void setFluctuationClassCode(String fluctuationClassCode) {
        this.fluctuationClassCode = fluctuationClassCode;
    }

    public String getModifiedYN() {
        return modifiedYN;
    }

    public void setModifiedYN(String modifiedYN) {
        this.modifiedYN = modifiedYN;
    }

    public String getPreviousDayVersus() {
        return previousDayVersus;
    }

    public void setPreviousDayVersus(String previousDayVersus) {
        this.previousDayVersus = previousDayVersus;
    }

    public String getPreviousDayVersusSign() {
        return previousDayVersusSign;
    }

    public void setPreviousDayVersusSign(String previousDayVersusSign) {
        this.previousDayVersusSign = previousDayVersusSign;
    }

    public String getFluctuationRate() {
        return fluctuationRate;
    }

    public void setFluctuationRate(String fluctuationRate) {
        this.fluctuationRate = fluctuationRate;
    }

    public String getRevelationIssueReason() {
        return revelationIssueReason;
    }

    public void setRevelationIssueReason(String revelationIssueReason) {
        this.revelationIssueReason = revelationIssueReason;
    }

    public String getStockBusinessDate() {
        return stockBusinessDate;
    }

    public void setStockBusinessDate(String stockBusinessDate) {
        this.stockBusinessDate = stockBusinessDate;
    }

    public String getStockClosingPrice() {
        return stockClosingPrice;
    }

    public void setStockClosingPrice(String stockClosingPrice) {
        this.stockClosingPrice = stockClosingPrice;
    }

    public String getStockHighPrice() {
        return stockHighPrice;
    }

    public void setStockHighPrice(String stockHighPrice) {
        this.stockHighPrice = stockHighPrice;
    }

    public String getStockLowPrice() {
        return stockLowPrice;
    }

    public void setStockLowPrice(String stockLowPrice) {
        this.stockLowPrice = stockLowPrice;
    }

    public String getStockOpeningPrice() {
        return stockOpeningPrice;
    }

    public void setStockOpeningPrice(String stockOpeningPrice) {
        this.stockOpeningPrice = stockOpeningPrice;
    }
}