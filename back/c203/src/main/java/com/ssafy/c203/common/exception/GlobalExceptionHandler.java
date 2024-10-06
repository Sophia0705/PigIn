package com.ssafy.c203.common.exception;

import com.ssafy.c203.domain.gold.exception.AutoFundingNotFoundException;
import com.ssafy.c203.domain.gold.exception.GoldFavoriteNotFoundException;
import com.ssafy.c203.domain.gold.exception.MoreSellException;
import com.ssafy.c203.domain.gold.exception.NoMoneyException;
import com.ssafy.c203.domain.gold.exception.PortfolioNotFoundException;
import com.ssafy.c203.domain.gold.exception.TradeErrorExeption;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationConflictException;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.EmailConflictException;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.WrongPasswordException;
import com.ssafy.c203.domain.pay.exception.BuyErrorException;
import com.ssafy.c203.domain.pay.exception.DepositErrorException;
import com.ssafy.c203.domain.pay.exception.MemberAccountNotFoundException;
import com.ssafy.c203.domain.quiz.exception.QuizAlreadySolvedException;
import com.ssafy.c203.domain.quiz.exception.QuizNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationConflictException.class)
    public ResponseEntity<String> handleAuthenticationConflictException(
        AuthenticationConflictException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<String> handleNotFoundException(MemberNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(EmailConflictException.class)
    public ResponseEntity<String> handleEmailConflictException(EmailConflictException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(WrongPasswordException.class)
    public ResponseEntity<String> handleWrongPasswordException(WrongPasswordException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(AuthenticationNotFoundException.class)
    public ResponseEntity<String> handleAuthenticationNotFoundException(
        AuthenticationNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(NoMoneyException.class)
    public ResponseEntity<String> handleNoMoneyException(NoMoneyException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(MoreSellException.class)
    public ResponseEntity<String> handleMoreSellException(MoreSellException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        // 로그 출력을 막거나 커스텀 로깅 처리
        return ResponseEntity.ok("IOException occurred but suppressed");
    }

    @ExceptionHandler(QuizNotFoundException.class)
    public ResponseEntity<String> handleQuizNotFoundException(QuizNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(QuizAlreadySolvedException.class)
    public ResponseEntity<String> handleQuizAlreadySolvedException(QuizAlreadySolvedException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(TradeErrorExeption.class)
    public ResponseEntity<String> handleTradeErrorExeption(TradeErrorExeption e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(AutoFundingNotFoundException.class)
    public ResponseEntity<String> handleAutoFundingNotFoundException(
        AutoFundingNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(GoldFavoriteNotFoundException.class)
    public ResponseEntity<String> handleGoldFavoriteNotFoundException(
        GoldFavoriteNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(PortfolioNotFoundException.class)
    public ResponseEntity<String> handlePortfolioNotFoundException(PortfolioNotFoundException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(MemberAccountNotFoundException.class)
    public ResponseEntity<String> handleMemberAccountNotFoundException(
        MemberAccountNotFoundException e
    ) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(BuyErrorException.class)
    public ResponseEntity<String> handleBuyErrorException(BuyErrorException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }

    @ExceptionHandler(DepositErrorException.class)
    public ResponseEntity<String> handleDepositErrorException(DepositErrorException e) {
        return ResponseEntity.status(e.getStatus()).body(e.getMessage());
    }
}
