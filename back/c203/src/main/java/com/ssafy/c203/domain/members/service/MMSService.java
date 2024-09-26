package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.ResponseDto.MMSResponseDto;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class MMSService {

    private final RestTemplate restTemplate;
    private String SECRETKEY;
    private String APIKEY;

    public MMSService(RestTemplate restTemplate, @Value("${message.key.secret}") String SECRETKEY,
        @Value("${message.key.apiKey}") String APIKEY) {
        this.restTemplate = restTemplate;
        this.SECRETKEY = SECRETKEY;
        this.APIKEY = APIKEY;
    }

    public boolean sendMMS(String text, String phoneNumber) throws Exception {
        log.info("SECRETKEY: {}", SECRETKEY);
        log.info("APIKEY: {}", APIKEY);
        String targetUrl = "http://api.coolsms.co.kr/messages/v4/send";
        Map<String, Object> params = new HashMap<>();
        Map<String, String> message = new HashMap<>();

        message.put("to", phoneNumber);
        message.put("from", "01076577097");
        message.put("text", text);
        message.put("type", "SMS");

        params.put("message", message);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", getHeaders());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, headers);

        ResponseEntity<MMSResponseDto> MMSResponse = restTemplate.exchange(
            targetUrl,
            HttpMethod.POST,
            entity,
            MMSResponseDto.class
        );

        HttpStatusCode statusCode = MMSResponse.getStatusCode();

        if (statusCode.equals(HttpStatus.OK)) {
            return true;
        }
        return false;
    }

    private String getHeaders() {
        try {
            String salt = UUID.randomUUID().toString().replaceAll("-", "");
            String date = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toString().split("\\[")[0];

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(SECRETKEY.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256");
            sha256_HMAC.init(secret_key);
            String signature = new String(
                Hex.encodeHex(sha256_HMAC.doFinal((date + salt).getBytes(StandardCharsets.UTF_8))));
            return "HMAC-SHA256 ApiKey=" + APIKEY + ", Date=" + date + ", salt=" + salt
                + ", signature=" + signature;
        } catch (InvalidKeyException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }
}