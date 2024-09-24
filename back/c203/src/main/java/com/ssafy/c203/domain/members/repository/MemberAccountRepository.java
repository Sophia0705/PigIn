package com.ssafy.c203.domain.members.repository;

import com.ssafy.c203.domain.members.entity.MemberAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberAccountRepository extends JpaRepository<MemberAccount, Long> {

}
