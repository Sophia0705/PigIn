import React from "react";
import StockItem from "../../stock/components/StockItem";
import { StockItemData } from "../../interfaces/StockInterface";

interface StockSearchResultsProps {
  filteredStocks: StockItemData[];
}

const StockSearchResults: React.FC<StockSearchResultsProps> = ({
  filteredStocks,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredStocks.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredStocks.map((stock) => (
          <StockItem
            key={stock.stck_shrn_iscd}
            name={stock.hts_kor_isnm}
            price={stock.stck_prpr}
            percentageChange={stock.prdy_ctrt}
            weeklyPrices={stock.weeklyPrices}
          />
        ))
      )}
    </div>
  );
};

export default StockSearchResults;
