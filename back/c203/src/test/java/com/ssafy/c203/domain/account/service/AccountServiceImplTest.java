package com.ssafy.c203.domain.account.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AccountServiceImplTest {

    @Autowired
    private AccountService accountService;

    @Test
    void findAccountBalance() {

        // 초기 잔액 확인 (옵션)
        Long initialBalance = accountService.findDAccountBalanceByMemberId(3L);

        // 입금
        accountService.depositAccount(3L, 10000L);

        // 입금 후 잔액 확인
        Long balanceAfterDeposit = accountService.findDAccountBalanceByMemberId(3L);

        // 출금
        accountService.withdrawAccount(3L, 5000L);  // 예시로 5000원 출금

        // 출금 후 최종 잔액 확인
        Long finalBalance = accountService.findDAccountBalanceByMemberId(3L);

        // 잔액 비교 및 검증
        assertEquals(initialBalance + 10000L, balanceAfterDeposit);
        assertEquals(balanceAfterDeposit - 5000L, finalBalance);
    }

}