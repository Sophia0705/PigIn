package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.members.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoinPortfolioRepository extends JpaRepository<CoinPortfolio, Long> {
    Optional<CoinPortfolio> findByCoinItemAndMember(CoinItem coinItem, Members member);
    Optional<CoinPortfolio> findByCoinItem_IdAndMember_Id(String coinId, Long userID);
}
