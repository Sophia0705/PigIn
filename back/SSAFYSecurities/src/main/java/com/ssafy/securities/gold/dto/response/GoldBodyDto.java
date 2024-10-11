package com.ssafy.securities.gold.dto.response;

import java.util.List;
import lombok.Data;

@Data
public class GoldBodyDto {
    private int numOfRows;
    private int pagNo;
    private int totalCount;
    private List<GoldItemDto> items;
}
