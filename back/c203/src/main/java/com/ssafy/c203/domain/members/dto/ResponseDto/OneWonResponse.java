package com.ssafy.c203.domain.members.dto.ResponseDto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OneWonResponse {

    @JsonProperty("Header")
    private OneWonHeader header;
    @JsonProperty("REC")
    private OneWonRec rec;

}
