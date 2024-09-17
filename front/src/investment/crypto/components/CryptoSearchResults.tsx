import React from "react";
import CryptoItem from "../../crypto/components/CryptoItem";

interface CryptoSearchResultsProps {
  filteredCryptos: Array<{
    name: string;
    symbol: string;
    price: number;
    marketCap: string;
    volume: string;
    percentageChange: string;
    openPrice: number;
    closePrice: number;
    high: number;
    low: number;
    weeklyPrices: number[];
    monthlyPrices: number[];
  }>;
}

const CryptoSearchResults: React.FC<CryptoSearchResultsProps> = ({ filteredCryptos }) => {
  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredCryptos.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredCryptos.map((crypto) => (
          <CryptoItem
            key={crypto.symbol}
            name={crypto.name}
            price={crypto.price}
            percentageChange={crypto.percentageChange}
            data={crypto.weeklyPrices.map((price, index) => ({
              name: `Day ${index + 1}`,
              value: price,
            }))}
          />
        ))
      )}
    </div>
  );
};

export default CryptoSearchResults;
