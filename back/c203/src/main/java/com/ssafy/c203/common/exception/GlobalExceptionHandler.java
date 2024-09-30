package com.ssafy.c203.common.exception;

import com.ssafy.c203.domain.gold.exception.MoreSellException;
import com.ssafy.c203.domain.gold.exception.NoMoneyException;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationConflictException;
import com.ssafy.c203.domain.members.exceprtion.AuthenticationNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.EmailConflictException;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.exceprtion.WrongPasswordException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationConflictException.class)
    public ResponseEntity<String> handleAuthenticationConflictException(AuthenticationConflictException e) {
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
    public ResponseEntity<String> handleAuthenticationNotFoundException(AuthenticationNotFoundException e) {
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
}
