package com.ssafy.c203.domain.account.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FindBalanceResponse {
    @JsonProperty("Header")
    private Header header;

    @JsonProperty("REC")
    private AccountRecord rec;

    @Data
    public static class Header {
        private String responseCode;
        private String responseMessage;
        private String apiName;
        private String transmissionDate;
        private String transmissionTime;
        private String institutionCode;
        private String apiKey;
        private String apiServiceCode;
        private String institutionTransactionUniqueNo;
    }

    @Data
    public static class AccountRecord {
        private String bankCode;
        private String accountNo;
        private String accountBalance;
        private String accountCreatedDate;
        private String accountExpiryDate;
        private String lastTransactionDate;
        private String currency;
    }
}
