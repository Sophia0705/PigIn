package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class UpdatePasswordDto {

    private String email;
    private String oldPassword;
    private String newPassword;
}
