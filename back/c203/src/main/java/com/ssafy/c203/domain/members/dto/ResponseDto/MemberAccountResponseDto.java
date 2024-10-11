package com.ssafy.c203.domain.members.dto.ResponseDto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class MemberAccountResponseDto {
    private String bank;
    private String accountNo;
    private Long money;

}
