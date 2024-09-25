package com.ssafy.myssafydata.dto.header;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

import java.text.SimpleDateFormat;
import java.util.Date;

@Data
public class UserHeader {

    private String apiName; // 외부 입력
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode = "00100";
    private String fintechAppNo = "001";
    private String apiServiceCode; // 외부 입력
    private String institutionTransactionUniqueNo;
    @Value("${SSAFY.api.key}")
    private String apiKey;
    private String userKey;

    // 생성자 (apiName, apiServiceCode는 외부에서 입력받고, 나머지는 자동으로 생성)
    public UserHeader(String apiName, String apiKey, String userKey) {
        this.apiName = apiName;
        this.apiServiceCode = apiName;
        this.apiKey = apiKey;
        this.userKey = userKey;
        setTransmissionDateTime();
        generateInstitutionTransactionUniqueNo();
    }

    // 전송일자 및 시각 설정
    private void setTransmissionDateTime() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HHmmss");
        Date now = new Date();
        this.transmissionDate = dateFormat.format(now);
        this.transmissionTime = timeFormat.format(now);
    }

    // 기관거래고유번호 생성 (현재 시각 기준으로 20자리)
    private void generateInstitutionTransactionUniqueNo() {
        String uniqueNumber = String.format("%06d", (int) (Math.random() * 1000000));
        this.institutionTransactionUniqueNo = this.transmissionDate + this.transmissionTime + uniqueNumber;
    }

    public String getApiName() {
        return apiName;
    }

    public void setApiName(String apiName) {
        this.apiName = apiName;
    }

    public String getTransmissionDate() {
        return transmissionDate;
    }

    public void setTransmissionDate(String transmissionDate) {
        this.transmissionDate = transmissionDate;
    }

    public String getTransmissionTime() {
        return transmissionTime;
    }

    public void setTransmissionTime(String transmissionTime) {
        this.transmissionTime = transmissionTime;
    }

    public String getInstitutionCode() {
        return institutionCode;
    }

    public void setInstitutionCode(String institutionCode) {
        this.institutionCode = institutionCode;
    }

    public String getFintechAppNo() {
        return fintechAppNo;
    }

    public void setFintechAppNo(String fintechAppNo) {
        this.fintechAppNo = fintechAppNo;
    }

    public String getApiServiceCode() {
        return apiServiceCode;
    }

    public void setApiServiceCode(String apiServiceCode) {
        this.apiServiceCode = apiServiceCode;
    }

    public String getInstitutionTransactionUniqueNo() {
        return institutionTransactionUniqueNo;
    }

    public void setInstitutionTransactionUniqueNo(String institutionTransactionUniqueNo) {
        this.institutionTransactionUniqueNo = institutionTransactionUniqueNo;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }
}
