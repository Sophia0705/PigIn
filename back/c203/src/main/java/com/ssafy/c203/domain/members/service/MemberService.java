package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.RequestDto.AccountAuthenticationCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MemberAccountDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdateMemberDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserInfoDto;
import com.ssafy.c203.domain.members.dto.ResponseDto.UserPortfolioResponse;
import com.ssafy.c203.domain.members.entity.Members;
import java.security.NoSuchAlgorithmException;

public interface MemberService {

    void singUp(Members members) throws Exception;

    boolean MMSGenerate(MMSDto mmsDto) throws Exception;

    boolean MMSCompare(MMSCompareDto mmsCompareDto);

    void withDrawalUser(Long userId);

    String findEmail(FindIdDto findIdDto);

    boolean findPassoword(FindPasswordDto findPasswordDto) throws Exception;

    void refreshPassword(RefreshPassowrdDto refreshPassowrdDto);

    void updateMember(UpdateMemberDto updateMemberDto, Long userId);

    UserInfoDto getUserInfo(Long userId);

    boolean oneWonSend(String accountNo, String userKey);

    String oneWonAuthentication(AccountAuthenticationCompareDto accountAuthenticationCompareDto, String userKey);

    void addAccount(MemberAccountDto memberAccountDto, Long userId);

    boolean emailCheck(String email);

    Members findMemberById(Long id);

    void setMoney(int money, Long userId);

    void updateAutoTrading(Long userId, boolean autoTrading, int price);

    Long checkSavingAccount(Long memberId);

    void getOneWonInformation(Long userId, String accountNo) throws Exception;
}
