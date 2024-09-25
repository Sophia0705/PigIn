package com.ssafy.myssafydata.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.myssafydata.dto.UserDTO;
import com.ssafy.myssafydata.entity.UserEntity;
import com.ssafy.myssafydata.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    @Value("${SSAFY.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    public UserDTO findUser(String email) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/member/search";

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("apiKey", apiKey);
        requestBody.put("userId", email);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<UserDTO> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                UserDTO.class
        );

        return response.getBody(); // 응답 본문 반환
    }

    public UserEntity userAdd(UserEntity userEntity) {
        // 1. 유저 등록 API 호출
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/member";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("apiKey", apiKey);
        requestBody.put("userId", userEntity.getEmail());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
        log.info(entity.toString());
        try {
            ResponseEntity<UserDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    UserDTO.class
            );
            if (response.getStatusCode().is2xxSuccessful()) {
                // 2. Entity 저장
                String userKey = response.getBody().getUserKey();
                userEntity.updateUserKey(userKey);
                userRepository.save(userEntity);

                return userEntity;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        // 3. 반환
        return null;
    }

    public List<UserEntity> findAllUsers() {
        return userRepository.findAll();
    }
}
