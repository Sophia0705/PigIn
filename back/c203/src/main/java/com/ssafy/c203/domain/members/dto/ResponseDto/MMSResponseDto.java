package com.ssafy.c203.domain.members.dto.ResponseDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class MMSResponseDto {
    private String groupId;
    private String to;
    private String from;
    private String type;
    private String statusMessage;
    private String country;
    private String messageId;
    private String statusCode;
    private String accountId;
}
