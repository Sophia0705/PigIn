import React from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from '../../crypto/components/CryptoItem';
import { CryptoItemData } from '../../interfaces/CryptoInterface';
import { getIndividualCryptoData } from '../../../api/investment/crypto/IndividualCryptoData';

interface CryptoSearchResultsProps {
  filteredCryptos: CryptoItemData[];
  bitcoinPrice: number;
}

const CryptoSearchResults: React.FC<CryptoSearchResultsProps> = ({
  filteredCryptos,
  bitcoinPrice,
}) => {
  const navigate = useNavigate();

  const handleItemClick = async (crypto: CryptoItemData) => {
    try {
      let bitcoinPrice = 1;
      if (crypto.coin === 'BTC-BCH' || crypto.coin === 'BTC-ETC') {
        const bitcoinData = await getIndividualCryptoData('KRW-BTC');
        bitcoinPrice = bitcoinData.close;
      }

      // 개별 가상화폐의 상세정보 가져오기
      const detailedCryptoData = await getIndividualCryptoData(crypto.coin);

      const isBitcoinRelated =
        crypto.coin === 'BTC-BCH' || crypto.coin === 'BTC-ETC';

      // 기존 목록 데이터에 주간, 월간, 연간 데이터를 추가하여 새로운 객체 생성
      const enrichedCryptoData = {
        ...detailedCryptoData,
        price: isBitcoinRelated
          ? Math.round(crypto.price * bitcoinPrice)
          : crypto.price,
        priceChange: crypto.priceChange,
        weeklyPrices: crypto.weeklyPrices,
        monthlyPrices: crypto.monthlyPrices,
        yearlyPrices: crypto.yearlyPrices,
      };

      navigate(`/investment/cryptocurrency/${crypto.coin}`, {
        state: {
          item: enrichedCryptoData,
        },
      });
    } catch (error) {
      console.error('가상화폐 상세정보 가져오는 중 에러 발생:', error);
    }
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
              price={
                crypto.coin === 'BTC-BCH' || crypto.coin === 'BTC-ETC'
                  ? Math.round(crypto.price * bitcoinPrice)
                  : crypto.price
              }
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
