package com.ssafy.c203.domain.members.dto.ResponseDto;

import lombok.Data;

@Data
public class OneWonHeader {

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
