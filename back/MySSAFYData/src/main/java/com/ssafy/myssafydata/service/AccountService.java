package com.ssafy.myssafydata.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.myssafydata.dto.AccountCreateDTO;
import com.ssafy.myssafydata.dto.AccountDTO;
import com.ssafy.myssafydata.dto.TransactionDTO;
import com.ssafy.myssafydata.dto.header.UserHeader;
import com.ssafy.myssafydata.dto.response.AccountAllResponse;
import com.ssafy.myssafydata.dto.response.AccountCreateResponse;
import com.ssafy.myssafydata.dto.response.DepositResponse;
import com.ssafy.myssafydata.dto.response.TransactionAllResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AccountService {

    @Value("${SSAFY.api.key}")
    private String apiKey;
    private final RestTemplate restTemplate;

    public List<TransactionDTO> findAllTransaction(String userKey, String accountNo) {

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";
        Map<String, Object> requestBody = new HashMap<>();
        UserHeader userHeader = new UserHeader("inquireTransactionHistoryList", apiKey, userKey);
        requestBody.put("Header", userHeader);
        requestBody.put("accountNo", accountNo);
        requestBody.put("startDate", "20240901");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        requestBody.put("endDate", dateFormat.format(new Date()));
        requestBody.put("transactionType", "A");
        requestBody.put("orderByType", "DESC");

        // 헤더 설정 (필요에 따라 추가 가능)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // HttpEntity에 헤더와 바디 설정
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 요청 전송 및 응답 받기
        ResponseEntity<TransactionAllResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                TransactionAllResponse.class
        );

        System.out.println(response.getBody().getRec().getList());
        return response.getBody().getRec().getList(); // 응답 본문 반환
    }

    public List<AccountDTO> findAccountList(String userKey) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountList";

        // 요청 바디 데이터 생성
        Map<String, Object> requestBody = new HashMap<>();

        UserHeader userHeader = new UserHeader("inquireDemandDepositAccountList", apiKey, userKey);
        requestBody.put("Header", userHeader);

        // 헤더 설정 (필요에 따라 추가 가능)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // HttpEntity에 헤더와 바디 설정
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // 요청 전송 및 응답 받기
        ResponseEntity<AccountAllResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                AccountAllResponse.class
        );

        return response.getBody().getRec(); // 응답 본문 반환
    }

    public boolean deposit(String userKey, String accountNo, String transactionBalance, String message) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountDeposit";
        Map<String, Object> requestBody = new HashMap<>();
        UserHeader userHeader = new UserHeader("updateDemandDepositAccountDeposit", apiKey, userKey);
        requestBody.put("Header", userHeader);
        requestBody.put("accountNo", accountNo);
        requestBody.put("transactionBalance", transactionBalance);
        requestBody.put("transactionSummary", message);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<DepositResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    DepositResponse.class
            );
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public AccountCreateDTO makeAccount(String userKey) {

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";
        Map<String, Object> requestBody = new HashMap<>();
        UserHeader userHeader = new UserHeader("createDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", userHeader);
        requestBody.put("accountTypeUniqueNo", "001-1-cdbd66677a0947");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        log.info(entity.toString());
        try {
            ResponseEntity<AccountCreateResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AccountCreateResponse.class
            );
            return response.getBody().getRec();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }
}
