package com.ssafy.myssafydata.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.myssafydata.dto.DepositRecDTO;
import com.ssafy.myssafydata.dto.header.UserHeader;
import lombok.Data;

@Data
public class DepositResponse {
    @JsonProperty("Header")
    private UserHeader header;

    @JsonProperty("REC")
    private DepositRecDTO rec;
}
