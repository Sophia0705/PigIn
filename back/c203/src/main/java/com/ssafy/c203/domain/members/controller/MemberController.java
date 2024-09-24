package com.ssafy.c203.domain.members.controller;

import com.ssafy.c203.common.jwt.JWTUtil;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.security.NoSuchAlgorithmException;
import java.util.Collection;
import java.util.Iterator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final MembersRepository membersRepository;

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
            .savingRate(signUpDto.getSavingRate())
            .build());
        return ResponseEntity.ok().body("회원가입을 성공하였습니다.");
    }

    @PostMapping("/mms-number-generate")
    public ResponseEntity<?> mmsNumberGenerate(@RequestBody MMSDto mmsDto) throws Exception {
        boolean isSend = memberService.MMSGenerate(mmsDto);
        if (isSend) {
            return ResponseEntity.ok().body("메시지 전송에 성공하였습니다.");
        }
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("메시지 전송 실패!!");
    }

    //Todo : 시간이 만료된거면 시간만료라 알려주고 그게 아니면 틀렸다고 보내기
    @PostMapping("/mms-number-compare")
    public ResponseEntity<?> mmsNumberCompare(@RequestBody MMSCompareDto mmsCompareDto) {
        boolean isExist = memberService.MMSCompare(mmsCompareDto);
        if (isExist) {
            return ResponseEntity.ok().body("인증번호가 같습니다.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 만료되었습니다.");
    }

    @DeleteMapping("/withdrawal")
    public ResponseEntity<?> withDrawalUser(@RequestBody String email) {
        memberService.withDrawalUser(email);
        return ResponseEntity.ok().body("회원탈퇴를 완료했습니다.");
    }

    @PostMapping("/test-sign-up")
    public ResponseEntity<?> testSignUp(@RequestBody SignUpDto signUpDto) throws Exception {
        Members member = Members
            .builder()
            .email(signUpDto.getEmail())
            .password(signUpDto.getPassword())
            .status(WithDrawalStatus.ACTIVE)
            .name(signUpDto.getName())
            .birth("123")
            .phoneNumber("123")
            .userKey("123")
            .role("123")
            .refreshToken("123")
            .savingRate(signUpDto.getSavingRate())
            .build();

        memberService.testSignUp(member);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find-id")
    public ResponseEntity<?> findByEmail(@RequestBody FindIdDto findIdDto) {
        String email = memberService.findEmail(findIdDto);
        if (email.equals("fail")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 번호로 가입된 아이디가 없습니다.");
        }
        return ResponseEntity.ok(email);
    }

    @PostMapping("/find-pwd")
    public ResponseEntity<?> findPassword(@RequestBody FindPasswordDto findPasswordDto)
        throws Exception {
        boolean isSend = memberService.findPassoword(findPasswordDto);
        if (isSend) {
            return ResponseEntity.ok("메시지 전송 성공");
        }
        return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("메시지 전송 실패!");
    }

    @PutMapping("/update-member")
    public ResponseEntity<?> updatePassword(@RequestBody UpdateMemberDto updateMemberDto,
        @AuthenticationPrincipal
        CustomUserDetails customUserDetails) {
        //Todo : 유저 저축 최대금액 수정부분 추가
        memberService.updateMember(updateMemberDto, customUserDetails.getUserId());
        return ResponseEntity.ok("패스워드 변경을 완료했습니다.");
    }

    @PutMapping("/refresh-pwd")
    public ResponseEntity<?> refreshPassword(@RequestBody RefreshPassowrdDto refreshPassowrdDto) {
        memberService.refreshPassword(refreshPassowrdDto);
        return ResponseEntity.ok("패스워드 변경을 완료했습니다.");
    }

    @PostMapping("/account-authentication")
    public ResponseEntity<?> accountAuthentication(@RequestBody String accountNo,
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String userKey = customUserDetails.getUserKey();
        boolean isSend = memberService.oneWonSend(accountNo, userKey);
        if (isSend) {
            return ResponseEntity.ok("1원 송금 완료");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 계좌가 아닙니다.");
    }

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

    @PostMapping("/account")
    public ResponseEntity<?> addAccount(@RequestBody MemberAccountDto memberAccountDto, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        memberService.addAccount(memberAccountDto, userId);

        return ResponseEntity.ok("계좌 등록 완료");
    }

    @GetMapping("/userInfo")
    public ResponseEntity<?> getUserInfo(
        @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Long userId = customUserDetails.getUserId();
        UserInfoDto userInfo = memberService.getUserInfo(userId);
        return ResponseEntity.ok(userInfo);
    }

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
        Members member = membersRepository.findByEmailAndStatus(username, WithDrawalStatus.ACTIVE).orElseThrow(
            MemberNotFoundException::new);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L, member.getUserKey(), member.getId());
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 86400000L, member.getUserKey(), member.getId());

        member.updateRefreshToken(newRefresh);
        membersRepository.save(member);

        //response
        response.setHeader("access", newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        return ResponseEntity.ok().build();
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
