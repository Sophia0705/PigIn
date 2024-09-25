package com.ssafy.myssafydata.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.myssafydata.dto.AccountCreateDTO;
import com.ssafy.myssafydata.dto.header.ResponseHeader;
import lombok.Data;

@Data
public class AccountCreateResponse {

    @JsonProperty("Header")
    private ResponseHeader header;

    @JsonProperty("REC")
    private AccountCreateDTO rec;
}
