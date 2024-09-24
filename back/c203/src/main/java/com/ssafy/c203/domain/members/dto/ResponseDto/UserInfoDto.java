package com.ssafy.c203.domain.members.dto.ResponseDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class UserInfoDto {
    private String email;
    private String name;
    private String phoneNumber;
    private String birth;
    private int savingRate;

    @Builder
    public UserInfoDto(String email, String name, String phoneNumber, String birth,
        int savingRate) {
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.birth = birth;
        this.savingRate = savingRate;
    }
}
