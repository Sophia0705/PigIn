package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class FindIdDto {
    private String name;
    private String phoneNumber;
}
