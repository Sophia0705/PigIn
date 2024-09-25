package com.ssafy.myssafydata.dto;

import lombok.Data;

import java.util.Map;

@Data
public class AccountCreateDTO {
    private String bankCode;
    private String accountNo;
    private Map<String, String> currency;
}
