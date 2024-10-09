import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ChevronRight, ThumbsUp } from 'lucide-react';

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

// Top5Lists 컴포넌트
interface TopItemProps {
  id: string;
  name: string;
}

const TopItem: React.FC<TopItemProps> = ({ id: _id, name }) => (
  <div className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
    <span className="text-black">{name}</span>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

interface Top5ListProps {
  title: string;
  items: TopItemProps[];
  isLoading: boolean;
  error: string | null;
}

const Top5List: React.FC<Top5ListProps> = ({
  title,
  items,
  isLoading,
  error,
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
          <TopItem key={item.id} id={item.id} name={item.name} />
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
      <div className="flex gap-1 p-2">
        <ThumbsUp size={24} color="#FFD700" />
        <p className="text-white text-xl font-semibold pl-4">
          이용자들이 많이 찜한 Top5 종목
        </p>
      </div>

      <div className="flex gap-9 p-2 bg-customDarkGreen">
        <Top5List
          title="주식 Top5"
          items={topStocks}
          isLoading={isLoadingStocks}
          error={errorStocks}
        />
        <Top5List
          title="가상화폐 Top5"
          items={topCryptos}
          isLoading={isLoadingCryptos}
          error={errorCryptos}
        />
      </div>
    </div>
  );
};

export default Top5Lists;
