package com.ssafy.c203.domain.stock.repository;

import com.ssafy.c203.domain.stock.entity.StockAutoFunding;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockAutoFundingRepository extends JpaRepository<StockAutoFunding, Long> {
    List<StockAutoFunding> findAllByMember_Id(Long memberId);

}
