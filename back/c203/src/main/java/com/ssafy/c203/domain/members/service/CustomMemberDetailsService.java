package com.ssafy.c203.domain.members.service;

import com.ssafy.c203.domain.members.dto.CustomUserDetails;
import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import com.ssafy.c203.domain.members.exceprtion.MemberNotFoundException;
import com.ssafy.c203.domain.members.repository.MembersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomMemberDetailsService implements UserDetailsService {

    private final MembersRepository membersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Members userData = membersRepository.findByEmailAndStatus(username, WithDrawalStatus.ACTIVE).orElseThrow(
            MemberNotFoundException::new);

        if (username != null) {
            //UserDetails에 담아서 return 하면 AuthenticationManager가 검증
            return new CustomUserDetails(userData);
        }
        return null;
    }
}
