package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.MMSAuthentication;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MMSAuthenticationRepository extends JpaRepository<MMSAuthentication, Long> {

    @Query("SELECT m FROM MMSAuthentication m "  +
        "WHERE m.authenticationNumber = :authNumber " +
        "AND m.phoneNumber = :phoneNumber " +
        "AND m.deadline > CURRENT_TIMESTAMP " +
        "ORDER BY m.deadline DESC")
    Optional<MMSAuthentication> findLatestValidAuthentication(
        @Param("authNumber") String authNumber,
        @Param("phoneNumber") String phoneNumber);
}
