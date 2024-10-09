package com.ssafy.c203.domain.pay.service;

import com.ssafy.c203.domain.account.service.AccountService;
import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import com.ssafy.c203.domain.coin.repository.CoinAutoFundingRepository;
import com.ssafy.c203.domain.coin.service.CoinService;
import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.entity.GoldAutoFunding;
import com.ssafy.c203.domain.gold.repository.GoldAutoFundingRepository;
import com.ssafy.c203.domain.gold.service.GoldService;
import com.ssafy.c203.domain.members.entity.MemberAccount;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MemberAccountRepository;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import com.ssafy.c203.domain.members.service.MMSService;
import com.ssafy.c203.domain.pay.exception.BuyErrorException;
import com.ssafy.c203.domain.pay.exception.DepositErrorException;
import com.ssafy.c203.domain.pay.exception.MemberAccountNotFoundException;
import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import com.ssafy.c203.domain.stock.repository.StockAutoFundingRepository;
import com.ssafy.c203.domain.stock.service.StockService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayServiceImpl implements PayService {

    private final MembersRepository membersRepository;
    private final MemberAccountRepository memberAccountRepository;
    private final AccountService accountService;
    private final GoldAutoFundingRepository goldAutoFundingRepository;
    private final CoinAutoFundingRepository coinAutoFundingRepository;
    private final StockAutoFundingRepository stockAutoFundingRepository;
    private final MMSService mmsService;
    private final GoldService goldService;
    private final CoinService coinService;
    private final StockService stockService;

    private final int PRICE = 100000;

    @Override
    public void payMoney(Long userId) throws Exception {
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

        mmsService.sendMMS(getMessage(member.getName(), memberAccount.getBank(), memberAccount.getAccountNo()), member.getPhoneNumber());
        log.info("문자 발송 후");
        //투자 계좌 입금하기
        int money = PRICE * savingRate / 100;
        Boolean isSaving = accountService.depositAccount(userId, Long.valueOf(money));
        log.info("isSaving = " + isSaving);
        if (!isSaving) {
            throw new DepositErrorException();
        }

        //잔액확인
        Long remindMoney = accountService.findDAccountBalanceByMemberId(
            member.getId());

        int memberSavingAmount = member.getSavingAmount();

        //자동투자 금액을 못넘기면 return
        if (remindMoney < memberSavingAmount) {
            return;
        }
        //주식
        List<StockAutoFunding> stocks = stockAutoFundingRepository.findAllByMember_Id(
            member.getId());

        for (StockAutoFunding stock : stocks) {
            String stockId = stock.getStockItem().getId();
            int stockRate = stock.getRate();

            int stockMoney = memberSavingAmount * stockRate / 100;

            stockService.buyStock(member.getId(), stockId, (long) stockMoney, false);
        }

        //코인
        List<CoinAutoFunding> coins = coinAutoFundingRepository.findAllByMember_Id(
            member.getId());

        for (CoinAutoFunding coin : coins) {
            String coinName = coin.getCoinItem().getName();
            int coinRate = coin.getRate();

            int coinMoney = memberSavingAmount * coinRate / 100;

            coinService.buyCoin(member.getId(), coinName, (double) coinMoney);
        }

        //금
        Optional<GoldAutoFunding> ogf = goldAutoFundingRepository.findByMember_Id(
            member.getId());
        if (ogf.isPresent()) {
            GoldAutoFunding goldAutoFunding = ogf.get();
            int goldRate = goldAutoFunding.getRate();

            int goldPrice = memberSavingAmount * goldRate / 100;
            goldService.goldTradeRequest(GoldTradeDto
                .builder()
                .method("BUY")
                .tradePrice(goldPrice)
                .build(), member.getId());
        }
    }

    private String getMessage(String memberName, String bankName, String accountNo) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd HH:mm");
        String formattedDateTime = now.format(formatter);

        String message = bankName + "(" + accountNo.substring(accountNo.length() - 4) + ") 승인 \n"
            + memberName.substring(0, 1) + "*" + memberName.substring(2) + "\n" + PRICE + "원\n"
            + formattedDateTime + "\n" + "PigIn 주식회사";

        return message;
    }
}
