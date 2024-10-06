package com.ssafy.c203.domain.coin.repository;

import com.ssafy.c203.domain.coin.entity.CoinFavorite;
import com.ssafy.c203.domain.coin.entity.CoinItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CoinFavoriteRepository extends JpaRepository<CoinFavorite, Long> {
    Optional<CoinFavorite> findByCoinItem_IdAndMember_Id(String coinId, Long userId);

    @Query("SELECT cf.coinItem " +
            "FROM CoinFavorite cf " +
            "GROUP BY cf.coinItem " +
            "ORDER BY COUNT(cf) DESC " +
            "LIMIT :limit")
    List<CoinItem> findTopNMostFavoriteCoin(@Param("limit") int limit);

    @Query("SELECT cf.coinItem FROM CoinFavorite cf WHERE cf.member.id = :memberId")
    List<CoinItem> findCoinItemsByMemberId(@Param("memberId") Long memberId);
}
