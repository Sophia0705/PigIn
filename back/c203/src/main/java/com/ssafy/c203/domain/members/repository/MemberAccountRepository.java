package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.MemberAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberAccountRepository extends JpaRepository<MemberAccount, Long> {
    Optional<MemberAccount> findByMember_Id(Long member_Id);
}
