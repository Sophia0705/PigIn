package com.ssafy.c203.domain.account.service;

public interface AccountService {
    // 잔고 확인
    public Long findDAccountBalanceByMemberId(Long memberId);
    // 입금
    public Boolean DepositAccount(Long memberId, Double amount);
    // 출금
    public Boolean WithdrawAccount(Long memberId, Double amount);
}
