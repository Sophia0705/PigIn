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
        Long Balance = accountService.findDAccountBalanceByMemberId(3L);
    }

}