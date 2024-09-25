package com.ssafy.myssafydata.dto;

import lombok.Data;

import java.util.List;

@Data
public class TransactionRecDTO {
    private Long totalCount;
    private List<TransactionDTO> list;

}
