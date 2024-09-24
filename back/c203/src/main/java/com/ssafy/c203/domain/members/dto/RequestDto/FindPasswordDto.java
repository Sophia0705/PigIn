package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class FindPasswordDto {
    private String name;
    private String phoneNumber;
    private String email;
}
