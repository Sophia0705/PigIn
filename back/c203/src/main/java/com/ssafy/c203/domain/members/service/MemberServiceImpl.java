package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.account.entity.SavingsAccount;
import com.ssafy.c203.domain.account.repository.SavingsAccountRepository;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.AccountNoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserKeyDto;
import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.exceprtion.ConflictException;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
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

    private static final String MMS_MESSAGE_TAIL = " PigIn 본인인증번호입니다. 정확히 입력하세요.";
    private final String MY_SSAFYDATA_BASE_URL = "${spring.ssafydata.url}";


    //Todo : 이메일 중복확인 구현 필요

    @Override
    @Transactional
    public void singUp(Members members) throws NoSuchAlgorithmException {
        Boolean isExist = membersRepository.existsByEmail(members.getEmail());

        //해당 이메일로 회원가입한 사람이 있으면 return
        if (isExist) {
            throw new ConflictException("이미 존재하는 이메일입니다.");
        }

        //패스워드 암호화
        String password = bCryptPasswordEncoder.encode(members.getPassword());

        //members에 salt값, password 지성
        members.updatePassword(password);

        //userkey 지정
        Map<String, String> requestBody = new HashMap<String, String>();
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
        Optional<MMSAuthentication> memberAuthentication = authenticationRepository.findFirstByPhoneNumberAndAuthenticationNumberAndDeadlineBeforeOrderByCreateTimeDesc(
            mmsCompareDto.getPhoneNumber(), mmsCompareDto.getAuthenticationNumber(), LocalDateTime.now());
        if (memberAuthentication.isPresent()) return true;
        return false;
    }

    @Override
    public void withDrawalUser(String email) {
        Members member = membersRepository.findByEmail(email);
        member.withDrawal();
    }

    @Override
    public void testSignUp(Members member) {
        member.updatePassword(bCryptPasswordEncoder.encode(member.getPassword()));
        membersRepository.save(member);
    }
}
