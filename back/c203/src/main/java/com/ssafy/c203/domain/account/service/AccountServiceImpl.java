package com.ssafy.c203.domain.account.service;

import com.ssafy.c203.common.dto.header.UserHeader;
import com.ssafy.c203.common.dto.response.OneWonAuthenticationDto;
import com.ssafy.c203.domain.account.dto.response.FindBalanceResponse;
import com.ssafy.c203.domain.account.entity.SavingsAccount;
import com.ssafy.c203.domain.account.repository.SavingsAccountRepository;
import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AccountServiceImpl implements AccountService{

    private final SavingsAccountRepository savingsAccountRepository;
    private final MemberService memberService;
    private final RestTemplate restTemplate;


    @Value("${ssafy.api.key}")
    private String apiKey;

    @Override
    @Transactional(readOnly = true)
    public Long findDAccountBalanceByMemberId(Long memberId) {
        // 1. 계좌번호 가져오기
        SavingsAccount account = savingsAccountRepository.findByMember_Id(memberId)
                .orElseThrow(RuntimeException::new);
        String accountNo = account.getAccountNo();

        // 2. userKey 가져오기
        Members member = memberService.findMemberById(memberId);
        String userKey = member.getUserKey();

        // 3. 메시지 생성
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountBalance";
        UserHeader header = new UserHeader("inquireDemandDepositAccountBalance", apiKey, userKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("accountNo", accountNo);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 4. 반환
        ResponseEntity<FindBalanceResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                FindBalanceResponse.class
        );
        return Long.valueOf(response.getBody().getRec().getAccountBalance());
    }

    @Override
    public Boolean DepositAccount(Long memberId, Double amount) {
        return null;
    }

    @Override
    public Boolean WithdrawAccount(Long memberId, Double amount) {
        return null;
    }
}
