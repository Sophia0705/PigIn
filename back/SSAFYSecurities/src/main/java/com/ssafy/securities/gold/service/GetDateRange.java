package com.ssafy.securities.gold.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class GetDateRange {

    public List<String> generateMonthlyStartEndDates(LocalDate startDate, LocalDate endDate) {
        List<String> dateList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        while (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
            // 해당 월의 첫 날짜 추가
            dateList.add(startDate.format(formatter));

            // 해당 월의 마지막 날짜 계산
            LocalDate lastDayOfMonth = startDate.withDayOfMonth(startDate.lengthOfMonth());

            // 마지막 날짜가 종료 날짜를 넘지 않도록 조정
            if (lastDayOfMonth.isAfter(endDate)) {
                lastDayOfMonth = endDate;
            }

            // 해당 월의 마지막 날짜 추가 (첫 날짜와 다른 경우에만)
            if (!lastDayOfMonth.isEqual(startDate)) {
                String lastDayString = lastDayOfMonth.format(formatter);

                // 마지막 날짜의 일(day)에 1을 더한 문자열 생성
                int lastDay = Integer.parseInt(lastDayString.substring(6));
                String nextDayString = lastDayString.substring(0, 6) + String.format("%02d", lastDay + 1);
                dateList.add(nextDayString);
            }

            // 다음 달의 첫 날로 이동
            startDate = startDate.plusMonths(1).withDayOfMonth(1);
        }

        return dateList;
    }
}