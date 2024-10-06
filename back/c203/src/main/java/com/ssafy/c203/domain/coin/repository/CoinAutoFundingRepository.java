package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinAutoFunding;
import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.List;

public interface CoinAutoFundingRepository extends JpaRepository<CoinAutoFunding, Long> {
    Optional<CoinAutoFunding> findByCoinItem_IdAndMember_Id(String coinCode, Long userId);
    void deleteByMember_Id(Long memberId);
    List<CoinAutoFunding> findByMember_Id(Long memberId);
    List<CoinAutoFunding> findAllByMember_Id(Long memberId);
}