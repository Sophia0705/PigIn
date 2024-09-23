package com.ssafy.c203.domain.members.dto.RequestDto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class UpdateMemberDto {

    private int savingRate;
    private String oldPassword;
    private String newPassword;
}
