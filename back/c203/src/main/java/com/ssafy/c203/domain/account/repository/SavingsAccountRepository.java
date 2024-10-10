package com.ssafy.c203.domain.account.repository;

import com.ssafy.c203.domain.account.entity.SavingsAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SavingsAccountRepository extends JpaRepository<SavingsAccount, Integer> {
    Optional<SavingsAccount> findByMember_Id(Long memberId);
    
}
