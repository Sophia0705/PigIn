package com.ssafy.c203.common.exception;

import com.ssafy.c203.common.exception.exceptions.UserNotFoundException;
import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ExceptionService {

    public void UserIdException(CustomUserDetails customUserDetails) {
        if (customUserDetails.getUserId() == null) {
            throw new UserNotFoundException("로그인 필요!");
        }
    }
}
