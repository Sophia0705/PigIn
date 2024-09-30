package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.common.dto.header.UserHeader;
import com.ssafy.c203.common.dto.response.OneWonAuthenticationDto;
import com.ssafy.c203.common.dto.response.OneWonResponseDto;
import com.ssafy.c203.domain.account.entity.SavingsAccount;
import com.ssafy.c203.domain.account.repository.SavingsAccountRepository;
import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MemberAccountDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdateMemberDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserInfoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserKeyDto;
import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import com.ssafy.c203.domain.members.entity.MemberAccount;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationConflictException;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.EmailConflictException;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.WrongPasswordException;
import com.ssafy.c203.domain.members.repository.MMSAuthenticationRepository;
import com.ssafy.c203.domain.members.repository.MemberAccountRepository;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MembersRepository membersRepository;
    private final RestTemplate restTemplate;
    private final SavingsAccountRepository savingsAccountRepository;
    private final MMSAuthenticationRepository authenticationRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberAccountRepository memberAccountRepository;
    private final MMSService mmsService;
    //Todo : application.properties에 추가
    @Value("${ssafy.api.key}")
    private String apiKey;

    private static final String MMS_MESSAGE_TAIL = " PigIn 본인인증번호입니다. 정확히 입력하세요.";

    @Value("${ssafy.ssafydata.url}")
    private String MY_SSAFYDATA_BASE_URL;

    //Todo : 이메일 중복확인 구현 필요

    @Override
    @Transactional
    public void singUp(Members members) throws NoSuchAlgorithmException {
        Members findMember = membersRepository.findByEmail(members.getEmail());

//        대중현
        //해당 이메일로 회원가입한 사람이 있으면 return
        if (findMember != null) {
            throw new EmailConflictException();
        }

        //패스워드 암호화
        String password = bCryptPasswordEncoder.encode(members.getPassword());
        members.updatePassword(password);

        //userkey 지정
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("email", members.getEmail());
        requestBody.put("name", members.getName());
        requestBody.put("phoneNumber", members.getPhoneNumber());
        requestBody.put("birth", members.getBirth());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<UserKeyDto> UserKeyResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL + "/api/user/add",
            HttpMethod.POST,
            entity,
            UserKeyDto.class
        );

        String userKey = UserKeyResponse.getBody().getUserKey();
        //Todo : getUserKey가 NULL일때 처리 필요
        members.updateUserKey(userKey);
        Members member = membersRepository.save(members);
        String accountNo = UserKeyResponse.getBody().getAccountNo();

        //거래계좌 개설
        requestBody = new HashMap<>();
        requestBody.put("email", members.getEmail());
        requestBody.put("name", members.getName());
        requestBody.put("phoneNumber", members.getPhoneNumber());
        requestBody.put("birth", members.getBirth());

        entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> AccountNoResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL + "/api/account/add",
            HttpMethod.POST,
            entity,
            String.class
        );
        //Todo : accountNo가 Null일때 처리 필요
        savingsAccountRepository.save(SavingsAccount
            .builder()
            .accountNo(accountNo)
            .member(member)
            .build());
    }

    @Override
    public boolean MMSGenerate(MMSDto mmsDto) throws Exception {
        //6자리 인증번호 만들기
        Random generator = new Random();
        generator.setSeed(System.currentTimeMillis());
        int randomNumber = generator.nextInt(1000000) % 1000000;
        String authenticationNumber = String.format("%06d", randomNumber);

        //메시지 보내기
        String message = "[" + authenticationNumber + ']' + MMS_MESSAGE_TAIL;
        boolean isSend = mmsService.sendMMS(message, mmsDto.getPhoneNumber());

        if (isSend) {
            authenticationRepository.save(MMSAuthentication
                .builder()
                .authenticationNumber(authenticationNumber)
                .phoneNumber(mmsDto.getPhoneNumber())
                .deadline(LocalDateTime.now().plusMinutes(5))
                .build());
            return true;
        }
        return false;
    }

    @Override
    public boolean MMSCompare(MMSCompareDto mmsCompareDto) {
        MMSAuthentication authentication = authenticationRepository.findLatestValidAuthentication(
                mmsCompareDto.getAuthenticationNumber(), mmsCompareDto.getPhoneNumber())
            .orElseThrow(AuthenticationNotFoundException::new);
        log.info(authentication.toString());
        if (mmsCompareDto.getAuthenticationNumber()
            .equals(authentication.getAuthenticationNumber())) {
            return true;
        } else {
            throw new AuthenticationConflictException();
        }
    }

    @Override
    @Transactional
    public void withDrawalUser(Long userId) {
        Members member = membersRepository.findByIdAndStatus(userId, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        member.withDrawal();
    }

    @Override
    public String findEmail(FindIdDto findIdDto) {
        Members member = membersRepository.findByPhoneNumberAndStatus(findIdDto.getPhoneNumber(),
            WithDrawalStatus.ACTIVE).orElseThrow(MemberNotFoundException::new);
        if (member.getName().equals(findIdDto.getName())) {
            return member.getEmail();
        }
        return "fail";
    }

    @Override
    public boolean findPassoword(FindPasswordDto findPasswordDto) throws Exception {
        Members member = membersRepository.findByEmailAndStatus(findPasswordDto.getEmail(),
                WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        //멤버 존재
        //휴대전화 인증
        //6자리 인증번호 만들기
        Random generator = new Random();
        generator.setSeed(System.currentTimeMillis());
        int randomNumber = generator.nextInt(1000000) % 1000000;
        String authenticationNumber = String.format("%06d", randomNumber);

        //메시지 보내기
        String message = "[" + authenticationNumber + ']' + MMS_MESSAGE_TAIL;
        boolean isSend = mmsService.sendMMS(message, findPasswordDto.getPhoneNumber());

        if (isSend) {
            authenticationRepository.save(MMSAuthentication
                .builder()
                .authenticationNumber(authenticationNumber)
                .phoneNumber(findPasswordDto.getPhoneNumber())
                .deadline(LocalDateTime.now().plusMinutes(5))
                .build());
            return true;
        }
        return false;
    }

    @Override
    public void refreshPassword(RefreshPassowrdDto refreshPassowrdDto) {
        Members member = membersRepository.findByEmailAndStatus(refreshPassowrdDto.getEmail(),
                WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        String password = bCryptPasswordEncoder.encode(refreshPassowrdDto.getPassword());

        member.updatePassword(password);
    }

    @Override
    @Transactional
    public void updateMember(UpdateMemberDto updateMemberDto, Long userId) {
        Members member = membersRepository.findByIdAndStatus(userId, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);

        //기존 패스워드 검증
        if (!member.getPassword()
            .equals(bCryptPasswordEncoder.encode(updateMemberDto.getOldPassword()))) {
            throw new WrongPasswordException();
        }

        //패스워드 변경인지 확인
        if (updateMemberDto.isChange()) {
            member.updatePassword(bCryptPasswordEncoder.encode(updateMemberDto.getNewPassword()));
        }

        //사용자 데이터 변경
        member.updateSavingRateAndPhoneNumber(updateMemberDto.getSavingRate(),
            updateMemberDto.getPhoneNumber());
    }

    @Override
    public UserInfoDto getUserInfo(Long userId) {
        Members member = membersRepository.findByIdAndStatus(userId, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        return UserInfoDto
            .builder()
            .birth(member.getBirth())
            .name(member.getName())
            .email(member.getEmail())
            .phoneNumber(member.getPhoneNumber())
            .savingRate(member.getSavingRate())
            .build();
    }

    @Override
    public boolean oneWonSend(String accountNo, String userKey) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/accountAuth/openAccountAuth";
        Map<String, Object> requestBody = new HashMap<>();
        UserHeader userHeader = new UserHeader("openAccountAuth", apiKey, userKey);
        requestBody.put("Header", userHeader);
        requestBody.put("accountNo", accountNo);
        requestBody.put("authText", "SSAFY");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        //요청 전송 및 응답 받기
        ResponseEntity<OneWonResponseDto> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            OneWonResponseDto.class
        );

        HttpStatusCode statusCode = response.getStatusCode();
        if (statusCode.equals(HttpStatus.OK)) {
            return true;
        }
        return false;
    }

    @Override
    public String oneWonAuthentication(
        AccountAuthenticationCompareDto accountAuthenticationCompareDto, String userKey) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/accountAuth/checkAuthCode";
        Map<String, Object> requestBody = new HashMap<>();
        UserHeader userHeader = new UserHeader("checkAuthCode", apiKey, userKey);
        requestBody.put("Header", userHeader);
        requestBody.put("accountNo", accountAuthenticationCompareDto.getAccountNo());
        requestBody.put("authText", "SSAFY");
        requestBody.put("authCode", accountAuthenticationCompareDto.getAuthCode());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        //요청 전송 및 응답 받기
        ResponseEntity<OneWonAuthenticationDto> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            OneWonAuthenticationDto.class
        );

        HttpStatusCode statusCode = response.getStatusCode();
        if (statusCode.equals(HttpStatus.OK)) {
            if (response.getBody().getREC().getStatus().equals("SUCCESS")) {
                return "SUCCESS";
            } else {
                return "FAIL";
            }
        }
        return "account not found";
    }

    @Override
    public void addAccount(MemberAccountDto memberAccountDto, Long userId) {
        Members member = membersRepository.findByIdAndStatus(userId, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);

        memberAccountRepository.save(MemberAccount
            .builder()
            .accountNo(memberAccountDto.getAccountNo())
            .bank(memberAccountDto.getBank())
            .member(member)
            .build());
    }

    @Override
    public boolean emailCheck(String email) {
        Members member = membersRepository.findByEmail(email);
        return member != null;
    }
}
