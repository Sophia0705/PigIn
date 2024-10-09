import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ChevronRight, ThumbsUp } from 'lucide-react';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../api/investment/stock/StockChartData';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../api/investment/crypto/CryptoChartData';
import { getIndividualStockData } from '../api/investment/stock/IndividualStockData';
import { getIndividualCryptoData } from '../api/investment/crypto/IndividualCryptoData';

export const fetchTopStocks = async () => {
  try {
    const response = await axiosInstance.get('api/stock/rank');
    console.log('주식Top5GET res', response.data);
    return response.data;
  } catch (error) {
    console.log('주식Top5GET 실패핑', error);
    throw error;
  }
};

export const fetchTopCryptos = async () => {
  try {
    const response = await axiosInstance.get('api/coin/rank');
    console.log('가상화폐Top5 GET res', response.data);
    return response.data;
  } catch (error) {
    console.log('가상화폐Top5 GET 실패핑', error);
    throw error;
  }
};

interface TopItemProps {
  id: string;
  name: string;
  type: 'stock' | 'crypto';
}

const TopItem: React.FC<TopItemProps> = ({ id, name, type }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      let completeData;
      if (type === 'stock') {
        const stockData = await getIndividualStockData(id);
        const weeklyPrices = await getWeeklyStockChartData(id, 'day');
        const monthlyPrices = await getMonthlyStockChartData(id, 'day');
        const yearlyPrices = await getYearlyStockChartData(id, 'month');

        completeData = {
          ...stockData,
          weeklyPrices: weeklyPrices.map((data) => Number(data.stck_clpr)),
          monthlyPrices: monthlyPrices.map((data) => Number(data.stck_clpr)),
          yearlyPrices: yearlyPrices.map((data) => Number(data.stck_clpr)),
        };

        navigate(`/investment/stock/${id}`, { state: { item: completeData } });
      } else {
        const cryptoData = await getIndividualCryptoData(id);
        const weeklyChartData = await getWeeklyCryptoChartData(id, 'day');
        const monthlyChartData = await getMonthlyCryptoChartData(id, 'day');
        const yearlyChartData = await getYearlyCryptoChartData(id, 'month');

        completeData = {
          ...cryptoData,
          weeklyPrices: weeklyChartData.map((data) => data.coin_clpr),
          monthlyPrices: monthlyChartData.map((data) => data.coin_clpr),
          yearlyPrices: yearlyChartData.map((data) => data.coin_clpr),
        };

        // 비트코인캐시, 이더리움클래식 가격 재조정
        if (id === 'BTC-BCH' || id === 'BTC-ETC') {
          const bitcoinData = await getIndividualCryptoData('KRW-BTC');
          const adjustedPrice = completeData.price * bitcoinData.price;
          completeData.price = Number(adjustedPrice.toFixed(0));
        }

        navigate(`/investment/cryptocurrency/${id}`, {
          state: { item: completeData },
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };

  return (
    <div
      className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0 cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <span className="text-black">{name}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
};

interface Top5ListProps {
  title: string;
  items: TopItemProps[];
  isLoading: boolean;
  error: string | null;
  type: 'stock' | 'crypto';
}

const Top5List: React.FC<Top5ListProps> = ({
  title,
  items,
  isLoading,
  error,
  type,
}) => (
  <div className="bg-blue-600 rounded-xl p-3 w-64 flex flex-col">
    <div className="flex-grow flex justify-center">
      <h2 className="text-white text-lg font-bold text-center mb-2">{title}</h2>
    </div>
    <div className="bg-white rounded-lg p-2">
      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">에러: {error}</p>}
      {!isLoading &&
        !error &&
        items.map((item) => (
          <TopItem key={item.id} id={item.id} name={item.name} type={type} />
        ))}
    </div>
  </div>
);

const Top5Lists: React.FC = () => {
  const [topStocks, setTopStocks] = useState<TopItemProps[]>([]);
  const [topCryptos, setTopCryptos] = useState<TopItemProps[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);
  const [errorStocks, setErrorStocks] = useState<string | null>(null);
  const [errorCryptos, setErrorCryptos] = useState<string | null>(null);

  useEffect(() => {
    const loadTopStocks = async () => {
      try {
        const data = await fetchTopStocks();
        setTopStocks(
          data.map((stock: any) => ({
            id: stock.stockItemId,
            name: stock.stockItemName,
            type: 'stock' as const,
          }))
        );
        setIsLoadingStocks(false);
      } catch (error) {
        console.error('Failed to fetch top stocks:', error);
        setErrorStocks('주식 데이터를 불러오는데 실패했습니다.');
        setIsLoadingStocks(false);
      }
    };

    const loadTopCryptos = async () => {
      try {
        const data = await fetchTopCryptos();
        setTopCryptos(
          data.map((crypto: any) => ({
            id: crypto.coinItemId,
            name: crypto.coinItemName,
            type: 'crypto' as const,
          }))
        );
        setIsLoadingCryptos(false);
      } catch (error) {
        console.error('Failed to fetch top cryptos:', error);
        setErrorCryptos('가상화폐 데이터를 불러오는데 실패했습니다.');
        setIsLoadingCryptos(false);
      }
    };

    loadTopStocks();
    loadTopCryptos();
  }, []);

  return (
    <div>
      <div className="flex item-center gap-2 p-2">
        <ThumbsUp size={45} color="#FFD700" className="ml-2" />
        <p className="text-white text-xl font-semibold pl-4">
          이용자들이 <br />
          많이 찜한 Top5 종목
        </p>
      </div>

      <div className="flex gap-9 p-2 bg-customDarkGreen">
        <Top5List
          title="주식 Top5"
          items={topStocks}
          isLoading={isLoadingStocks}
          error={errorStocks}
          type="stock"
        />
        <Top5List
          title="가상화폐 Top5"
          items={topCryptos}
          isLoading={isLoadingCryptos}
          error={errorCryptos}
          type="crypto"
        />
      </div>
    </div>
  );
};

export default Top5Lists;
