package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdateMemberDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserInfoDto;
import com.ssafy.c203.domain.members.entity.Members;
import java.security.NoSuchAlgorithmException;

public interface MemberService {

    void singUp(Members members) throws NoSuchAlgorithmException;

    boolean MMSGenerate(MMSDto mmsDto) throws Exception;

    boolean MMSCompare(MMSCompareDto mmsCompareDto);

    void withDrawalUser(String email);

    void testSignUp(Members member);

    String findEmail(FindIdDto findIdDto);

    boolean findPassoword(FindPasswordDto findPasswordDto) throws Exception;

    void refreshPassword(RefreshPassowrdDto refreshPassowrdDto);

    void updateMember(UpdateMemberDto updateMemberDto, Long userId);

    UserInfoDto getUserInfo(Long userId);

    boolean oneWonSend(String accountNo, String userKey);

    void oneWonAuthentication(AccountAuthenticationCompareDto accountAuthenticationCompareDto, String userKey);
}
