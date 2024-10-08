package com.ssafy.c203.common.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.c203.common.dto.header.ResponseHeader;
import lombok.Data;

@Data
public class OneWonAuthenticationDto {

    private ResponseHeader Header;
    @JsonProperty("REC")
    private OneWonAuthenticationRECDto Rec;
}
