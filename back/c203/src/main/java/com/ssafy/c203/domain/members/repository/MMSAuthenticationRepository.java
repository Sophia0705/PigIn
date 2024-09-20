package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MMSAuthenticationRepository extends JpaRepository<MMSAuthentication, Long> {

    Optional<MMSAuthentication> findFirstByPhoneNumberAndAuthenticationNumberAndDeadlineBeforeOrderByCreateTimeDesc(
        String phoneNumber, String authenticationNumber, LocalDateTime currentDateTime);
}
