package com.ssafy.myssafydata.dto.request;

import lombok.Data;

@Data
public class UserAddRequest {
    private String email;
    private String name;
    private String phoneNumber;
    private String birth;
}
