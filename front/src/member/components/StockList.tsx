import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockItem from './StockItem';
import { fetchStockFavoriteAPI } from '../../api/member/fetchStockFavoriteAPI'; // 주식 찜 목록 API
import { getWeeklyStockChartData } from '../../api/investment/stock/StockChartData'; // 주식 주간 차트 데이터 API

interface StockListProps {
  limit?: number; // 표시할 주식 항목의 최대 개수 (선택적)
  showTitle?: boolean; // 제목과 "더 보기" 버튼 표시 여부 (기본값은 true)
}

// 주식 데이터를 위한 인터페이스 정의
interface Stock {
  stockName: string; // 주식 이름
  stockCode: string; // 주식 코드
  price: number; // 주식 가격
  priceChange: number; // 주식 등락률
  weeklyPrices: number[]; // 주간 가격 데이터
}

const StockList: React.FC<StockListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<Stock[]>([]); // API에서 불러온 주식 목록
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(''); // 에러 메시지 관리

  useEffect(() => {
    // 주식 찜 목록 불러오고, 각 주식에 대해 주간 차트를 추가로 불러오는 함수
    const loadStockFavorites = async () => {
      try {
        const stockData = await fetchStockFavoriteAPI(limit || 5); // 찜한 주식 목록 불러오기
        const stockWithWeeklyPrices = await Promise.all(
          stockData.map(async (stock: Stock) => {
            try {
              const weeklyPricesData = await getWeeklyStockChartData(
                stock.stockCode,
                'week',
                7
              ); // 주간 가격 데이터 가져오기
              const weeklyPrices = weeklyPricesData.map((item) =>
                parseFloat(item.stck_clpr)
              ); // 클로징 가격만 추출
              return { ...stock, weeklyPrices }; // 주간 가격 데이터를 포함한 주식 데이터 반환
            } catch (error) {
              console.error(
                `Error fetching weekly prices for stock ${stock.stockCode}:`,
                error
              );
              return { ...stock, weeklyPrices: [] }; // 실패할 경우 빈 배열로 대체
            }
          })
        );
        console.log('최종 데이터:', stockWithWeeklyPrices); // 최종 데이터 확인
        setStocks(stockWithWeeklyPrices); // 상태에 저장
      } catch (error) {
        setError('주식 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    loadStockFavorites(); // 컴포넌트 렌더링 시 API 호출
  }, [limit]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mt-8 mb-0">
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">주식</h2>
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-4 py-1 hover:bg-gray-200"
              onClick={() => navigate('/stock-favorites')}
            >
              더 보기
            </button>
          )}
        </div>
      )}

      <div className="p-0">
        {stocks.map((stock) => (
          <StockItem
            key={stock.stockCode} // 고유한 주식 ID를 key로 설정
            name={stock.stockName} // 주식 이름
            code={stock.stockCode} // 주식 코드
            price={stock.price} // 주식 현재가
            percentageChange={stock.priceChange} // 주식의 등락률
            weeklyPrices={stock.weeklyPrices} // 주간 가격 데이터
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;
