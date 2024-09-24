package com.ssafy.c203.common.dto.response;

import com.ssafy.c203.common.dto.header.ResponseHeader;
import lombok.Data;

@Data
public class OneWonAuthenticationDto {

    private ResponseHeader Header;
    private OneWonAuthenticationRECDto REC;
}
