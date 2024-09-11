package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.SignUpDto;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.service.MMSService;
import com.ssafy.c203.domain.members.service.MemberService;
import java.security.NoSuchAlgorithmException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final RestTemplate restTemplate;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@ModelAttribute SignUpDto signUpDto)
        throws NoSuchAlgorithmException {
        memberService.singUp(Members
            .builder()
            .name(signUpDto.getName())
            .email(signUpDto.getEmail())
            .birth(signUpDto.getBirth())
            .phoneNumber(signUpDto.getPhoneNumber())
            .status(WithDrawalStatus.ACTIVE)
            .password(signUpDto.getPassword())
            .build());
        return ResponseEntity.ok().body("회원가입을 성공하였습니다.");
    }

    @PostMapping("/mms-number-generate")
    public ResponseEntity<?> mmsNumberGenerate(@RequestBody MMSDto mmsDto) throws Exception {
        memberService.MMSGenerate(mmsDto);
        return ResponseEntity.ok().body("");
    }
}
