package com.ssafy.myssafydata.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "members")
public class UserEntity {

    @Id
    @Column(name = "userkey")
    private String userKey;

    private String email;
    private String name;
    @Column(name = "phonenumber")
    private String phoneNumber;
    private String birth;

    public void updateUserKey(String userKey) {
        this.userKey = userKey;
    }

}
