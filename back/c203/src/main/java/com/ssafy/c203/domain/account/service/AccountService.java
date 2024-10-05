package com.ssafy.c203.domain.account.service;

import com.ssafy.c203.domain.members.entity.Members;

public interface AccountService {
    // 잔고 확인
    public Long findDAccountBalanceByMemberId(Long memberId);
    // 입금
    public Boolean depositAccount(Long memberId, Long price);
    // 출금
    public Boolean withdrawAccount(Long memberId, Long price);

    Boolean withdrawTradeAccount(Members member, String accountNo, Long price);
}
