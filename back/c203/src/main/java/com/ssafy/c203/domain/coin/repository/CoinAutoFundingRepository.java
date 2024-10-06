package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinAutoFundingRepository extends JpaRepository<CoinAutoFunding, Long> {

    List<CoinAutoFunding> findAllByMember_Id(Long memberId);
}
