package com.ssafy.securities.stock.dto.header;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RequestHeader {
    @JsonProperty("content-type")
    private final String contentType = "application/json";

    private String authorization;
    @JsonProperty("appkey")
    private String appKey;

    @JsonProperty("appsecret")
    private String appSecret;

    private final String tr_id = "FHKST03010100";
}
