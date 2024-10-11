import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import { CryptoItemData } from '../../investment/interfaces/CryptoInterface';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../../api/investment/crypto/CryptoChartData';
import { getIndividualCryptoData } from '../../api/investment/crypto/IndividualCryptoData';
import { fetchCryptoFavoriteAPI } from '../../api/member/fetchCryptoFavoriteAPI';

interface CryptoListProps {
  limit?: number; // 표시할 암호화폐 항목의 최대 개수 (선택적)
  showTitle?: boolean; // 제목과 "더 보기" 버튼 표시 여부 (기본값은 true)
}

const CryptoList: React.FC<CryptoListProps> = ({
  limit = 5,
  showTitle = true,
}) => {
  const [cryptoData, setCryptoData] = useState<CryptoItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // API 호출 함수
  const fetchCryptoData = async () => {
    try {
      // fetchCryptoFavoriteAPI를 사용하여 찜한 가상화폐 목록만 가져오기
      const favoriteCryptoList = await fetchCryptoFavoriteAPI(limit);

      const detailedCryptoData = await Promise.all(
        favoriteCryptoList.map(async (crypto: any) => {
          const { coin } = crypto;

          // 개별 가상화폐 상세 정보와 차트 데이터 가져오기
          const details = await getIndividualCryptoData(coin);
          const weeklyChartData = await getWeeklyCryptoChartData(coin, 'day');
          const monthlyChartData = await getMonthlyCryptoChartData(coin, 'day');
          const yearlyChartData = await getYearlyCryptoChartData(coin, 'month');

          // 주간, 월간, 연간 종가 데이터 추출 (배열 순서 유지)
          const weeklyPrices = weeklyChartData.map((data) => data.coin_clpr);
          const monthlyPrices = monthlyChartData.map((data) => data.coin_clpr);
          const yearlyPrices = yearlyChartData.map((data) => data.coin_clpr);

          // price와 priceChange를 fetchCryptoFavoriteAPI에서 가져와 설정
          const price = parseFloat(crypto.price);
          const priceChange = crypto.priceChange;

          return {
            ...details,
            price,
            priceChange,
            weeklyPrices,
            monthlyPrices,
            yearlyPrices,
          };
        })
      );

      setCryptoData(detailedCryptoData);
    } catch (error) {
      console.error('가상화폐 찜 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, [limit]);

  const handleItemClick = (item: CryptoItemData) => {
    navigate(`/investment/cryptocurrency/${item.coin}`, {
      state: { item },
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mb-0">
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">
            가상화폐
          </h2>
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-2 py-1 hover:bg-gray-200"
              onClick={() => navigate('/crypto-favorites')}
            >
              더 보기
            </button>
          )}
        </div>
      )}

      <div className="p-0">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.coin}
            onClick={() => handleItemClick(crypto)}
            className="cursor-pointer"
          >
            <CryptoItem
              name={crypto.coinName}
              symbol={crypto.coin}
              price={crypto.price}
              priceChange={crypto.priceChange}
              weeklyPrices={crypto.weeklyPrices}
              monthlyPrices={crypto.monthlyPrices}
              yearlyPrices={crypto.yearlyPrices}
              open={crypto.open}
              close={crypto.close}
              high={crypto.high}
              low={crypto.low}
              volume={crypto.volume}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
