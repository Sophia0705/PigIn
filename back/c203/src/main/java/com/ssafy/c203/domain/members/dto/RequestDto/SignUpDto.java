package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class SignUpDto {

    private String name;
    private String phoneNumber;
    private String birth;
    private String email;
    private String password;
    private int savingRate;
}
