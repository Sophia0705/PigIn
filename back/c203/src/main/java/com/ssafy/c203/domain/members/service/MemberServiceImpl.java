package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.common.dto.header.UserHeader;
import com.ssafy.c203.domain.account.entity.SavingsAccount;
import com.ssafy.c203.domain.account.repository.SavingsAccountRepository;
import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdateMemberDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.AccountNoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserInfoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserKeyDto;
import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationConflictException;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.EmailConflictException;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.WrongPasswordException;
import com.ssafy.c203.domain.members.repository.MMSAuthenticationRepository;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
    //Todo : application.properties에 추가
    private String apiKey = "test";

    private static final String MMS_MESSAGE_TAIL = " PigIn 본인인증번호입니다. 정확히 입력하세요.";
    private final String MY_SSAFYDATA_BASE_URL = "${spring.ssafydata.url}";

    //Todo : 이메일 중복확인 구현 필요

    @Override
    @Transactional
    public void singUp(Members members) throws NoSuchAlgorithmException {
        Boolean isExist = membersRepository.existsByEmail(members.getEmail());

        //해당 이메일로 회원가입한 사람이 있으면 return
        if (isExist) {
            throw new EmailConflictException();
        }

        //패스워드 암호화
        String password = bCryptPasswordEncoder.encode(members.getPassword());

        //members에 salt값, password 지성
        members.updatePassword(password);

        //userkey 지정
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", members.getEmail());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<UserKeyDto> UserKeyResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL,
            HttpMethod.POST,
            entity,
            UserKeyDto.class
        );

        String userKey = UserKeyResponse.getBody().getUserKey();
        //Todo : getUserKey가 NULL일때 처리 필요
        members.updateUserKey(userKey);
        Members member = membersRepository.save(members);

        //계좌 개설
        requestBody = new HashMap<>();
        requestBody.put("userKey", userKey);

        //Todo : 등록용 계좌개설을 해야함
        entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<AccountNoDto> AccountNoResponse = restTemplate.exchange(
            MY_SSAFYDATA_BASE_URL,
            HttpMethod.POST,
            entity,
            AccountNoDto.class
        );

        String accountNo = AccountNoResponse.getBody().getAccountNo();
        //Todo : accountNo가 Null일때 처리 필요
        savingsAccountRepository.save(SavingsAccount
            .builder()
            .accountNo(accountNo)
            .member(member)
            .build());
    }

    @Override
    public boolean MMSGenerate(MMSDto mmsDto) throws Exception {
        MMSService mmsService = new MMSService(restTemplate);

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
        MMSAuthentication authentication = authenticationRepository.findFirstByPhoneNumberAndAuthenticationNumberAndDeadlineBeforeOrderByCreateTimeDesc(
            mmsCompareDto.getPhoneNumber(), mmsCompareDto.getAuthenticationNumber(),
            LocalDateTime.now()).orElseThrow(AuthenticationNotFoundException::new);
        if (mmsCompareDto.getAuthenticationNumber()
            .equals(authentication.getAuthenticationNumber())) {
            return true;
        } else {
            throw new AuthenticationConflictException();
        }
    }

    @Override
    public void withDrawalUser(String email) {
        Members member = membersRepository.findByEmailAndStatus(email, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        member.withDrawal();
    }

    @Override
    public void testSignUp(Members member) {
        member.updatePassword(bCryptPasswordEncoder.encode(member.getPassword()));
        membersRepository.save(member);
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
        MMSService mmsService = new MMSService(restTemplate);

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
    public void updateMember(UpdateMemberDto updateMemberDto, Long userId) {
        Members member = membersRepository.findByIdAndStatus(userId, WithDrawalStatus.ACTIVE)
            .orElseThrow(MemberNotFoundException::new);
        if (member.getPassword().equals(bCryptPasswordEncoder.encode(
            updateMemberDto.getOldPassword()))) {
            member.updatePassword(bCryptPasswordEncoder.encode(updateMemberDto.getNewPassword()));
            member.updateSavingRate(updateMemberDto.getSavingRate());
        } else {
            throw new WrongPasswordException();
        }
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
    public void oneWonSend(String accountNo, String userKey) {
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
//        ResponseEntity<TransactionAllResponse> response = restTemplate.exchange(
//            url,
//            HttpMethod.POST,
//            entity,
//            TransactionAllResponse.class
//        );
    }
}
