package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.RequestDto.FindIdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.FindPasswordDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSCompareDto;
import com.ssafy.c203.domain.members.dto.RequestDto.MMSDto;
import com.ssafy.c203.domain.members.dto.RequestDto.RefreshPassowrdDto;
import com.ssafy.c203.domain.members.dto.RequestDto.SignUpDto;
import com.ssafy.c203.domain.members.dto.RequestDto.UpdatePasswordDto;
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

    void updatePassword(UpdatePasswordDto updatePasswordDto);
}
