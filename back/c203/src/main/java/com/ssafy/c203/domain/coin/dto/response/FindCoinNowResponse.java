package com.ssafy.c203.domain.coin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FindCoinNowResponse {
    private boolean isLive;
    private FindCoinResponse data;
}
