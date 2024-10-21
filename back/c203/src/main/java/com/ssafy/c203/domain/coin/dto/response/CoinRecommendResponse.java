package com.ssafy.c203.domain.coin.dto.response;

import com.ssafy.c203.domain.coin.entity.CoinItem;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CoinRecommendResponse {

        private String coinCode;
        private String coinName;

        public CoinRecommendResponse(CoinItem coinItem) {
            this.coinCode = coinItem.getId();
            this.coinName = coinItem.getName();
        }


}
