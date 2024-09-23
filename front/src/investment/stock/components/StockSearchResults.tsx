import React from "react";
import { useNavigate } from "react-router-dom";
import StockItem from "../../stock/components/StockItem";
import { StockItemData } from "../../interfaces/StockInterface";

interface StockSearchResultsProps {
  filteredStocks: StockItemData[];
}

const StockSearchResults: React.FC<StockSearchResultsProps> = ({
  filteredStocks,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (stock: StockItemData) => {
    navigate(`/investment/stock/${stock.stck_shrn_iscd}`, {
      state: { item: stock },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredStocks.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredStocks.map((stock) => (
          <div
            key={stock.stck_shrn_iscd}
            className="cursor-pointer"
            onClick={() => handleItemClick(stock)}
          >
            <StockItem
              name={stock.hts_kor_isnm}
              price={stock.stck_prpr}
              percentageChange={stock.prdy_ctrt}
              weeklyPrices={stock.weeklyPrices}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default StockSearchResults;
