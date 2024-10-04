package com.ssafy.securities.stock.dto.apiResponse;

import lombok.Data;

@Data
public class AccessTokenResponse {
    private String access_token;
    private String access_token_type;
    private String token_type;
    private String expires_in;
}
