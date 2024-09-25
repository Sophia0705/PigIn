package com.ssafy.myssafydata.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.myssafydata.dto.TransactionRecDTO;
import com.ssafy.myssafydata.dto.header.ResponseHeader;
import lombok.Data;

@Data
public class TransactionAllResponse {

    @JsonProperty("Header")
    private ResponseHeader header;

    @JsonProperty("REC")
    private TransactionRecDTO rec;
}
