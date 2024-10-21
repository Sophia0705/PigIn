package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.dto.response.CoinRankDto;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import com.ssafy.c203.domain.coin.entity.CoinPortfolio;
import com.ssafy.c203.domain.members.entity.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;

public interface CoinPortfolioRepository extends JpaRepository<CoinPortfolio, Long> {

    Optional<CoinPortfolio> findByCoinItemAndMember(CoinItem coinItem, Members member);

    Optional<CoinPortfolio> findByCoinItem_IdAndMember_Id(String coinId, Long userID);

    List<CoinPortfolio> findByMember_Id(Long userId);

    @Query(
        "SELECT new com.ssafy.c203.domain.coin.dto.response.CoinRankDto(cp.coinItem.id, cp.coinItem.name) "
            +
            "FROM CoinPortfolio cp " +
            "GROUP BY cp.coinItem.id, cp.coinItem.name " +
            "ORDER BY SUM(cp.amount) " +
            "LIMIT 5")
    List<CoinRankDto> getCoinRankDto();
}
