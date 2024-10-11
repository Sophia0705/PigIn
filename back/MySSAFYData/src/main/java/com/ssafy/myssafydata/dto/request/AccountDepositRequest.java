package com.ssafy.myssafydata.dto.request;

import lombok.Data;

@Data
public class AccountDepositRequest {
    private String money;
    private String userKey;
    private String accountNo;
}
