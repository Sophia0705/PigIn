package com.ssafy.securities.coin.entity;

import com.ssafy.securities.coin.dto.CoinMinuteDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.*;
import java.util.Date;

@Document(collection = "coinMinute")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinMinute {

    @Id
    private String id; // [code + date + minute]
    private String coin; // 코인 종류
    private LocalDate date;
    private LocalTime time;
    private Double open;
    private Double close;
    private Double high;
    private Double low;
    private Double volume;
    private Double changePrice;

    @Indexed(expireAfterSeconds = 172800) // 2 days in seconds
    private Instant createdAt = Instant.now();

    // CoinMinuteDTO를 사용하여 CoinMinute 객체를 생성하는 생성자
    public CoinMinute(CoinMinuteDTO coinMinuteDTO) {
        this.coin = coinMinuteDTO.getCode(); // 코인 코드
        this.open = coinMinuteDTO.getOpeningPrice(); // 시가
        this.close = coinMinuteDTO.getTradePrice(); // 현재 거래가 (종가)
        this.high = coinMinuteDTO.getHighPrice(); // 고가
        this.low = coinMinuteDTO.getLowPrice(); // 저가
        this.volume = coinMinuteDTO.getTradeVolume(); // 거래량
        this.changePrice = coinMinuteDTO.getChangePrice(); // 가격 변화량

        // 날짜와 시간을 처리
        String tradeDate = coinMinuteDTO.getTradeDate(); // 거래 날짜 (형식: "yyyyMMdd")
        String tradeTime = coinMinuteDTO.getTradeTime(); // 거래 시간 (형식: "HHmmss")

        // LocalDate 및 LocalTime으로 변환
        this.date = LocalDate.parse(tradeDate, java.time.format.DateTimeFormatter.BASIC_ISO_DATE); // yyyyMMdd 형식
        this.time = LocalTime.parse(tradeTime, java.time.format.DateTimeFormatter.ofPattern("HHmmss")); // HHmmss 형식

        // ID 생성: [코인 코드 + 거래 날짜 + 거래 시간]
        this.id = this.coin + this.date + this.time.toString();
    }

    public void setTimeToKST() {
        // UTC의 날짜와 시간 정보를 결합
        LocalDateTime utcDateTime = LocalDateTime.of(date, time);

        ZonedDateTime kstDateTime = utcDateTime.atZone(ZoneId.of("UTC"))
                .withZoneSameInstant(ZoneId.of("Asia/Seoul"));

        // 변환된 KST 시간을 필드에 설정
        this.date = kstDateTime.toLocalDate();
        this.time = kstDateTime.toLocalTime();
    }
}
