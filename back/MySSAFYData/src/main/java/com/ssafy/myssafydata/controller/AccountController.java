package com.ssafy.myssafydata.controller;

import com.ssafy.myssafydata.dto.AccountDTO;
import com.ssafy.myssafydata.dto.TransactionDTO;
import com.ssafy.myssafydata.dto.request.AccountDepositRequest;
import com.ssafy.myssafydata.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    @GetMapping()
    public String accounts(@RequestParam String userKey, Model model) {
        List<AccountDTO> accounts = accountService.findAccountList(userKey);
        model.addAttribute("userKey", userKey);
        model.addAttribute("accounts", accounts);
        return "accounts";
    }


    @GetMapping("/list")
    public String accountFind(@RequestParam String accountNo, @RequestParam String userKey, Model model) {

        List<TransactionDTO> transactionDTOs = accountService.findAllTransaction(userKey, accountNo);

        model.addAttribute("trades", transactionDTOs);
        model.addAttribute("userKey", userKey);
        model.addAttribute("accountNo", accountNo);
        return "account";
    }

    @PostMapping("/deposit")
    public String deposit(AccountDepositRequest accountDepositRequest, Model model) {
        log.info("deposit accountNo = " + accountDepositRequest.toString());

        // 서비스 입금 로직
        boolean result = accountService.deposit(accountDepositRequest.getUserKey(), accountDepositRequest.getAccountNo(), accountDepositRequest.getMoney(), "Web 입금");

        return "redirect:/accounts/list?userKey=" + accountDepositRequest.getUserKey() + "&accountNo=" + accountDepositRequest.getAccountNo();
    }


}
