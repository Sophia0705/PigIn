package com.ssafy.c203.common.dto.response;

import com.ssafy.c203.common.dto.header.ResponseHeader;
import lombok.Data;

@Data
public class OneWonResponseDto {
    private ResponseHeader Header;
    private OneWonRECDto REC;
}
