import React from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from '../../crypto/components/CryptoItem';
import { CryptoItemData } from '../../interfaces/CryptoInterface';

interface CryptoSearchResultsProps {
  filteredCryptos: CryptoItemData[];
}

const CryptoSearchResults: React.FC<CryptoSearchResultsProps> = ({
  filteredCryptos,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (crypto: CryptoItemData) => {
    navigate(`/investment/cryptocurrency/${crypto.coin}`, {
      state: { item: crypto },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 mt-4 shadow-md w-full max-w-md">
      {filteredCryptos.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        filteredCryptos.map((crypto) => (
          <div
            key={crypto.coin}
            className="cursor-pointer"
            onClick={() => handleItemClick(crypto)}
          >
            <CryptoItem
              name={crypto.coinName}
              price={crypto.price}
              priceChange={crypto.priceChange}
              weeklyPrices={crypto.weeklyPrices}
              monthlyPrices={[]}
              yearlyPrices={[]}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default CryptoSearchResults;
