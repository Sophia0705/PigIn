package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembersRepository extends JpaRepository<Members, Integer> {
    Boolean existsByEmail(String email);

    //userId를 받아 DB 테이블에서 회원을 조회하는 메소드 작성 -> 우리코드에서 id = email
    Members findByEmail(String email);

    boolean existsByRefreshToken(String refreshToken);

    Members findByRefreshToken(String refreshToken);
}
