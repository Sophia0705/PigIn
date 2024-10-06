package com.ssafy.c203.domain.pay.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.members.entity.MemberAccount;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MemberAccountRepository;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import com.ssafy.c203.domain.pay.exception.BuyErrorException;
import com.ssafy.c203.domain.pay.exception.DepositErrorException;
import com.ssafy.c203.domain.pay.exception.MemberAccountNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PayServiceImpl implements PayService {

    private final MembersRepository membersRepository;
    private final MemberAccountRepository memberAccountRepository;
    private final AccountService accountService;

    private final int PRICE = 100000;

    @Override
    public void payMoney(Long userId) {
        Members member = membersRepository.findById(userId)
            .orElseThrow(MemberNotFoundException::new);

        int savingRate = member.getSavingRate();

        //거래 계좌 가져오기
        MemberAccount memberAccount = memberAccountRepository.findByMember_Id(userId)
            .orElseThrow(MemberAccountNotFoundException::new);
        String tradeAccountNo = memberAccount.getAccountNo();

        //거래 계좌 돈빼기
        Boolean isWithdraw = accountService.withdrawTradeAccount(member, tradeAccountNo,
            Long.valueOf(PRICE));
        if (!isWithdraw) {
            throw new BuyErrorException();
        }

        //투자 계좌 입금하기
        int money = PRICE * (savingRate / 100);
        Boolean isSaving = accountService.depositAccount(userId, Long.valueOf(money));
        if (!isSaving) {
            throw new DepositErrorException();
        }
    }
}
