import React from "react";
import StockItem from "../../stock/components/StockItem";

interface StockSearchResultsProps {
  filteredStocks: Array<{
    name: string;
    price: number;
    percentageChange: string;
    weeklyPrices: number[];
  }>;
}

const StockSearchResults: React.FC<StockSearchResultsProps> = ({ filteredStocks }) => {
  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredStocks.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredStocks.map((stock) => (
          <StockItem
            key={stock.name}
            name={stock.name}
            price={stock.price}
            percentageChange={stock.percentageChange}
            weeklyPrices={stock.weeklyPrices}
          />
        ))
      )}
    </div>
  );
};

export default StockSearchResults;
