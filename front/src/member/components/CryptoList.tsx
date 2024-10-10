import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import {
  CryptoListData,
  CryptoItemData,
  CryptoChartData,
} from '../../investment/interfaces/CryptoInterface';
import { getCryptoList } from '../../api/investment/crypto/CryptoList';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../../api/investment/crypto/CryptoChartData';
import { getIndividualCryptoData } from '../../api/investment/crypto/IndividualCryptoData';

interface CryptoListProps {
  limit?: number; // 표시할 암호화폐 항목의 최대 개수 (선택적)
  showTitle?: boolean; // 제목과 "더 보기" 버튼 표시 여부 (기본값은 true)
}

const CryptoList: React.FC<CryptoListProps> = ({ limit, showTitle = true }) => {
  const [cryptoData, setCryptoData] = useState<CryptoItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCryptoData = async () => {
    const cryptoList: CryptoListData[] = await getCryptoList();

    const detailedCryptoData = await Promise.all(
      cryptoList.map(async (crypto) => {
        const details = await getIndividualCryptoData(crypto.coin);

        // 주간, 월간, 연간 차트 데이터 가져오기
        const weeklyChartData: CryptoChartData[] =
          await getWeeklyCryptoChartData(crypto.coin, 'day');
        const monthlyChartData: CryptoChartData[] =
          await getMonthlyCryptoChartData(crypto.coin, 'day');
        const yearlyChartData: CryptoChartData[] =
          await getYearlyCryptoChartData(crypto.coin, 'month');

        // 주간, 월간, 연간 종가 데이터 추출 (배열 순서 유지)
        const weeklyPrices = weeklyChartData.map((data) => data.coin_clpr);
        const monthlyPrices = monthlyChartData.map((data) => data.coin_clpr);
        const yearlyPrices = yearlyChartData.map((data) => data.coin_clpr);

        // price와 priceChange를 CryptoListData에서 가져와 설정
        let price = parseFloat(crypto.price);
        const priceChange = crypto.priceChange;

        // 비트코인 가격 가져오기
        const bitcoinPriceData = cryptoList.find(
          (item) => item.coin === 'KRW-BTC'
        );
        const bitcoinPrice = bitcoinPriceData
          ? parseFloat(bitcoinPriceData.price)
          : 0;

        // 비트코인캐시와 이더리움클래식의 가격 재조정 (price만)
        if (crypto.coin === 'BTC-BCH' || crypto.coin === 'BTC-ETC') {
          if (bitcoinPrice) {
            price = parseFloat((price * bitcoinPrice).toFixed(0));
          }
        }

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

    const filteredCryptoData = detailedCryptoData.filter(
      (crypto) => crypto !== null
    ) as CryptoItemData[];

    setCryptoData(filteredCryptoData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCryptoData();
  }, [limit]);

  const handleItemClick = (item: CryptoItemData) => {
    navigate(`/investment/cryptocurrency/${item.coin}`, {
      state: { item },
    });
  };

  if (loading) return null;

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
        {cryptoData.slice(0, limit).map((crypto) => (
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
