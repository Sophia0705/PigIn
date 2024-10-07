package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.common.jwt.JWTUtil;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.AccountNoDto;
import com.ssafy.c203.domain.members.dto.RequestDto.AutoFundingMoneyDto;
import com.ssafy.c203.domain.members.dto.RequestDto.EmailCheckDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MemberAccountDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.SignUpDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdateMemberDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserInfoDto;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import com.ssafy.c203.domain.members.service.MemberService;
import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.NoSuchAlgorithmException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "멤버 컨트롤러", description = "멤버 생성, 조회, 삭제 등 전반적인 멤버를 관리하는 클래스")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final MembersRepository membersRepository;

    @Operation(summary = "회원가입", description = "<big>회원가입</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "회원가입을 성공하였습니다."),
    })
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignUpDto signUpDto)
        throws Exception {
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

    @Operation(summary = "인증번호 SMS발송", description = "<big>인증번호를 발송</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "메시지 전송에 성공하였습니다."),
        @ApiResponse(responseCode = "408", description = "메시지 전송 실패!!")
    })
    @PostMapping("/mms-number-generate")
    public ResponseEntity<?> mmsNumberGenerate(@RequestBody MMSDto mmsDto) throws Exception {
        boolean isSend = memberService.MMSGenerate(mmsDto);
        if (isSend) {
            return ResponseEntity.ok().body("메시지 전송에 성공하였습니다.");
        }
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("메시지 전송 실패!!");
    }

    //Todo : 시간이 만료된거면 시간만료라 알려주고 그게 아니면 틀렸다고 보내기
    @Operation(summary = "메세지 인증 검증", description = "<big>메시지 인증을 검증</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인증번호가 같습니다."),
        @ApiResponse(responseCode = "400", description = "인증번호가 만료되었습니다."),
        @ApiResponse(responseCode = "409", description = "인증번호가 틀렸습니다.")
    })
    @PostMapping("/mms-number-compare")
    public ResponseEntity<?> mmsNumberCompare(@RequestBody MMSCompareDto mmsCompareDto) {
        boolean isExist = memberService.MMSCompare(mmsCompareDto);
        if (isExist) {
            return ResponseEntity.ok().body("인증번호가 같습니다.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 만료되었습니다.");
    }

    @Operation(summary = "회원탈퇴", description = "<big>회원탈퇴</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "회원탈퇴를 완료했습니다."),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다.")
    })
    @DeleteMapping("/withdrawal")
    public ResponseEntity<?> withDrawalUser(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        memberService.withDrawalUser(userId);
        return ResponseEntity.ok().body("회원탈퇴를 완료했습니다.");
    }

    @Operation(summary = "아이디 찾기", description = "<big>아이디 차지</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "ID(이메일) response"),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다.")
    })
    @PostMapping("/find-id")
    public ResponseEntity<?> findByEmail(@RequestBody FindIdDto findIdDto) {
        String email = memberService.findEmail(findIdDto);
        if (email.equals("fail")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 번호로 가입된 아이디가 없습니다.");
        }
        return ResponseEntity.ok(email);
    }

    @Operation(summary = "비밀번호 찾기", description = "<big>비밀번호 찾기</big> 합니다. 이메일 검증을 통해 사용자가 존재하는지 확인 후 존재하면 메시지 인증번호를 보냄")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다."),
        @ApiResponse(responseCode = "408", description = "메시지 전송 실패!")
    })
    @PostMapping("/find-pwd")
    public ResponseEntity<?> findPassword(@RequestBody FindPasswordDto findPasswordDto)
        throws Exception {
        boolean isSend = memberService.findPassoword(findPasswordDto);
        if (isSend) {
            return ResponseEntity.ok("메시지 전송 성공");
        }
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("메시지 전송 실패!");
    }

    @Operation(summary = "사용자 정보 수정", description = "<big>사용자의 정보를 수정</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "사용자 정보 수정을 완료했습니다."),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다.")
    })
    @PutMapping("/update-member")
    public ResponseEntity<?> updateMember(@RequestBody UpdateMemberDto updateMemberDto,
        @AuthenticationPrincipal
        CustomUserDetails customUserDetails) {
        //Todo : 유저 저축 최대금액 수정부분 추가
        memberService.updateMember(updateMemberDto, customUserDetails.getUserId());
        return ResponseEntity.ok("사용자 정보 수정을 완료했습니다.");
    }

    @Operation(summary = "패스워드 재설정", description = "<big>패스워드를 재설정</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "패스워드 변경을 완료했습니다."),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다.")
    })
    @PutMapping("/refresh-pwd")
    public ResponseEntity<?> refreshPassword(@RequestBody RefreshPassowrdDto refreshPassowrdDto) {
        memberService.refreshPassword(refreshPassowrdDto);
        return ResponseEntity.ok("패스워드 변경을 완료했습니다.");
    }

    @Operation(summary = "1원 송금", description = "<big>1원 송금</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "1원 송금 완료"),
        @ApiResponse(responseCode = "404", description = "등록된 계좌가 아닙니다.")
    })
    @PostMapping("/account-authentication")
    public ResponseEntity<?> accountAuthentication(@RequestBody AccountNoDto accountNoDto,@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String userKey = customUserDetails.getUserKey();
        Long userId = customUserDetails.getUserId();
        boolean isSend = memberService.oneWonSend(accountNoDto.getAccountNo(), userKey);
        if (isSend) {
            return ResponseEntity.ok("1원 송금 완료");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 계좌가 아닙니다.");
    }

    @Operation(summary = "1원 송금 인증", description = "<big>1원 송금을 인증</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인증 성공"),
        @ApiResponse(responseCode = "401", description = "인증 실패"),
        @ApiResponse(responseCode = "404", description = "등록된 계좌가 아닙니다.")
    })
    @PostMapping("/account-authentication-compare")
    public ResponseEntity<?> accountAuthenticationCompare(@RequestBody
    AccountAuthenticationCompareDto accountAuthenticationCompareDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String userKey = customUserDetails.getUserKey();
        String response = memberService.oneWonAuthentication(accountAuthenticationCompareDto,
            userKey);
        if (response.equals("SUCCESS")) {
            return ResponseEntity.ok("인증 성공");
        } else if (response.equals("FAIL")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 계좌가 아닙니다.");
        }
    }

    @Operation(summary = "소비 통장 등록", description = "<big>소비용 통장을 등록</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 등록 완료"),
        @ApiResponse(responseCode = "404", description = "해당 member를 찾지 못했습니다.")
    })
    @PostMapping("/account")
    public ResponseEntity<?> addAccount(@RequestBody MemberAccountDto memberAccountDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        memberService.addAccount(memberAccountDto, userId);

        return ResponseEntity.ok("계좌 등록 완료");
    }

    @Operation(summary = "유저정보 조회", description = "<big>유저정보를 조회</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "유저정보"),
    })
    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        UserInfoDto userInfo = memberService.getUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }

    @Operation(summary = "access토큰 재발급", description = "<big>access토큰을 재발급</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = ""),
    })
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        //get refresh token
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {

            if (cookie.getName().equals("refresh")) {

                refresh = cookie.getValue();
            }
        }

        if (refresh == null) {

            //response status code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("refresh token null");
        }

        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {

            //response status code
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("refresh token expired");
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        boolean isExist = membersRepository.existsByRefreshToken(refresh);

        if (!isExist) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid refresh token");
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        Members member = membersRepository.findByEmailAndStatus(username, WithDrawalStatus.ACTIVE)
            .orElseThrow(
                MemberNotFoundException::new);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L, member.getUserKey(),
            member.getId());
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L,
            member.getUserKey(), member.getId());

        member.updateRefreshToken(newRefresh);
        membersRepository.save(member);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이메일 중복확인", description = "<big>이메일 중복 확인</big> 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = ""),
        @ApiResponse(responseCode = "409", description = "이메일이 이미 존재합니다.")
    })
    @PostMapping("/email-check")
    public ResponseEntity<?> emailCheck(@RequestBody EmailCheckDto email) {
        boolean isExist = memberService.emailCheck(email.getEmail());
        if (isExist) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이메일이 이미 존재합니다.");
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/money-set")
    public ResponseEntity<?> setMoney(@RequestBody AutoFundingMoneyDto autoFundingMoneyDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        memberService.setMoney(autoFundingMoneyDto.getMoney(), userId);
        return ResponseEntity.ok("금액 설정 완료");
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        Long userBalance = memberService.checkSavingAccount(userId);
        return ResponseEntity.ok(userBalance);
    }

    @GetMapping("/one-won-information")
    public ResponseEntity<?> getOneWonInformation(@RequestBody AccountNoDto accountNoDto,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) throws Exception {
        Long userId = customUserDetails.getUserId();
        memberService.getOneWonInformation(userId, accountNoDto.getAccountNo());
        return ResponseEntity.ok("인증번호 전송 성공");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None"); // 이 속성 추가
        cookie.setHttpOnly(true);
        return cookie;
    }


}
