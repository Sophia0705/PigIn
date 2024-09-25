package com.ssafy.myssafydata.dto;

import lombok.Data;

@Data
public class UserApiRequestDTO {
    private String email;
    private String name;
    private String phoneNumber;
    private String birth;
}
