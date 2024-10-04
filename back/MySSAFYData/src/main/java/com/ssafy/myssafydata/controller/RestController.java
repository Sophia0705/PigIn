package com.ssafy.myssafydata.controller;

import com.ssafy.myssafydata.dto.AccountCreateDTO;
import com.ssafy.myssafydata.dto.UserApiRequestDTO;
import com.ssafy.myssafydata.dto.response.UserAddResponse;
import com.ssafy.myssafydata.dto.request.AccountMakeRequest;
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

@org.springframework.web.bind.annotation.RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class RestController {
    private final UserService userService;
    private final AccountService accountService;

    @PostMapping("/user/add")
    public ResponseEntity<?> addUser(@RequestBody UserApiRequestDTO userApiRequestDTO) {

        log.info("add user {}", userApiRequestDTO.getEmail());

        UserEntity user = UserEntity.builder()
                .email(userApiRequestDTO.getEmail())
                .name(userApiRequestDTO.getName())
                .phoneNumber(userApiRequestDTO.getPhoneNumber())
                .birth(userApiRequestDTO.getBirth())
                .build();

        UserEntity result = userService.userAdd(user);

        UserAddResponse response = new UserAddResponse();

        if (result!= null) {
            AccountCreateDTO dto = accountService.makeAccount(result.getUserKey());
            response.setAccountNo(dto.getAccountNo());
            response.setUserKey(result.getUserKey());
            return ResponseEntity.ok().body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add user");
    }
    
    // 투자계좌 생성
    @PostMapping("/account/add")
    public ResponseEntity<?> addAccount(@RequestBody AccountMakeRequest request) {
        log.info("add account {}", request.getEmail());
        AccountCreateDTO account = accountService.makeAccount(request.getUserKey());

        if (account != null) {
            accountService.deposit(request.getUserKey(), account.getAccountNo(), "1000000", "기본 입금");
            return ResponseEntity.ok().body(account.getAccountNo());
        }



        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add account");
    }

}
