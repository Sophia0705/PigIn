package com.ssafy.myssafydata.dto.header;

public class ResponseHeader  {
    private String responseCode;
    private String responseMessage;
    private String apiName;
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode;
    private String apiKey;
    private String apiServiceCode;
    private String institutionTransactionUniqueNo;

    public String getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
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

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
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

    @Override
    public String toString() {
        return "ResponseHeader{" +
                "responseCode='" + responseCode + '\'' +
                ", responseMessage='" + responseMessage + '\'' +
                ", apiName='" + apiName + '\'' +
                ", transmissionDate='" + transmissionDate + '\'' +
                ", transmissionTime='" + transmissionTime + '\'' +
                ", institutionCode='" + institutionCode + '\'' +
                ", apiKey='" + apiKey + '\'' +
                ", apiServiceCode='" + apiServiceCode + '\'' +
                ", institutionTransactionUniqueNo='" + institutionTransactionUniqueNo + '\'' +
                '}';
    }
}
