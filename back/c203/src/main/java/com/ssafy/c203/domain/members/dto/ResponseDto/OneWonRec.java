package com.ssafy.c203.domain.members.dto.ResponseDto;

import java.util.List;
import lombok.Data;

@Data
public class OneWonRec {

    private String totalCount;
    private List<OneWonHistoryDto> list;
}
