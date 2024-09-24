package com.ssafy.c203.common.dto.response;

import lombok.Data;

@Data
public class OneWonAuthenticationRECDto {

    private String status;
    private String transactionUniqueNo;
    private String accountNo;
}
