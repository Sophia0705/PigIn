package com.ssafy.c203.domain.account.repository;

import com.ssafy.c203.domain.account.entity.SavingsAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingsAccountRepository extends JpaRepository<SavingsAccount, Integer> {

}
