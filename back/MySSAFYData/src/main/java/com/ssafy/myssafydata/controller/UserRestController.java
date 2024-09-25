package com.ssafy.myssafydata.controller;

import com.ssafy.myssafydata.dto.AccountCreateDTO;
import com.ssafy.myssafydata.dto.UserApiRequestDTO;
import com.ssafy.myssafydata.entity.UserEntity;
import com.ssafy.myssafydata.service.AccountService;
import com.ssafy.myssafydata.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/user")
public class UserRestController {
    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody UserApiRequestDTO userApiRequestDTO) {

        log.info("add user {}", userApiRequestDTO.getEmail());

        UserEntity user = UserEntity.builder()
                .email(userApiRequestDTO.getEmail())
                .name(userApiRequestDTO.getName())
                .phoneNumber(userApiRequestDTO.getPhoneNumber())
                .birth(userApiRequestDTO.getBirth())
                .build();

        UserEntity result = userService.userAdd(user);

        if (result!= null) {
            AccountCreateDTO dto = accountService.makeAccount(result.getUserKey());
            accountService.deposit(user.getUserKey(), dto.getAccountNo(), "1000000", "기본 입금");
            return ResponseEntity.ok().body(dto.getAccountNo());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add user");
    }

}
