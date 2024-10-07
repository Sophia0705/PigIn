package com.ssafy.c203.domain.members.dto.ResponseDto;

import lombok.Data;

@Data
public class OneWonHistoryDto {

    private String transactionUniqueNo;
    private String transactionDate;
    private String transactionTime;
    private String transactionType;
    private String transactionTypeName;
    private String transactionAccountNo;
    private String transactionBalance;
    private String transactionAfterBalance;
    private String transactionSummary;
    private String transactionMemo;

}
