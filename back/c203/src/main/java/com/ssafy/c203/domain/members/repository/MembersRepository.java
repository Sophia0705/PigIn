package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.Members;
import com.ssafy.c203.domain.members.entity.WithDrawalStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembersRepository extends JpaRepository<Members, Long> {
    Members findByEmail(String email);

    //userId를 받아 DB 테이블에서 회원을 조회하는 메소드 작성 -> 우리코드에서 id = email
    Optional<Members> findByEmailAndStatus(String email, WithDrawalStatus withDrawalStatus);

    boolean existsByRefreshToken(String refreshToken);

    Members findByRefreshToken(String refreshToken);

    Optional<Members> findByPhoneNumberAndStatus(String phoneNumber, WithDrawalStatus withDrawalStatus);

    Optional<Members> findByIdAndStatus(Long id, WithDrawalStatus withDrawalStatus);
}
