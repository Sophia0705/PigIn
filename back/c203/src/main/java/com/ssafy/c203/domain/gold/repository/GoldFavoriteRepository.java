package com.ssafy.c203.domain.gold.repository;

import com.ssafy.c203.domain.gold.entity.GoldFavorite;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoldFavoriteRepository extends JpaRepository<GoldFavorite, Long> {
    Optional<GoldFavorite> findByMember_Id(Long memberId);
    boolean ExistsByMember_Id(Long memberId);
}
