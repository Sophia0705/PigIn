import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockItem from './StockItem';
import { fetchStockFavoriteAPI } from '../../api/member/fetchStockFavoriteAPI'; // 주식 찜 목록 API
import { getIndividualStockData } from '../../api/investment/stock/IndividualStockData';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../../api/investment/stock/StockChartData'; // 주식 데이터 API
import { StockItemData } from '../../investment/interfaces/StockInterface';

// StockData 타입 정의
interface StockData {
  stockName: string;
  stockCode: string;
  price: number;
  priceChange: number;
}

interface StockListProps {
  limit?: number; // 표시할 주식 항목의 최대 개수 (선택적)
  showTitle?: boolean; // 제목과 "더 보기" 버튼 표시 여부 (기본값은 true)
}

const StockList: React.FC<StockListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<StockItemData[]>([]); // API에서 불러온 주식 목록
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(''); // 에러 메시지 관리

  useEffect(() => {
    // 주식 찜 목록 불러오고, 각 주식에 대해 모든 데이터를 가져오는 함수
    const loadStockFavorites = async () => {
      try {
        const stockData = await fetchStockFavoriteAPI(limit || 5); // 찜한 주식 목록 불러오기
        const stockWithDetails = await Promise.all(
          stockData.map(async (stock: StockData) => {
            try {
              // 주식별 상세정보 가져오기
              const stockDetails = await getIndividualStockData(
                stock.stockCode
              );

              // 주간, 월간, 연간 데이터 가져오기
              const weeklyPricesData = await getWeeklyStockChartData(
                stock.stockCode,
                'day'
              );
              const monthlyPricesData = await getMonthlyStockChartData(
                stock.stockCode,
                'day'
              );
              const yearlyPricesData = await getYearlyStockChartData(
                stock.stockCode,
                'month'
              );

              // 주간, 월간, 연간 종가 데이터만 추출
              const weeklyPrices = weeklyPricesData.map((data) =>
                Number(data.stck_clpr)
              );
              const monthlyPrices = monthlyPricesData.map((data) =>
                Number(data.stck_clpr)
              );
              const yearlyPrices = yearlyPricesData.map((data) =>
                Number(data.stck_clpr)
              );

              // StockItemData 형식으로 변환
              return {
                ...stockDetails,
                hts_kor_isnm: stock.stockName,
                stck_shrn_iscd: stock.stockCode,
                stck_prpr: Number(stock.price),
                prdy_ctrt: stock.priceChange.toString(),
                weeklyPrices: weeklyPrices,
                monthlyPrices: monthlyPrices,
                yearlyPrices: yearlyPrices,
              };
            } catch (error) {
              console.error(
                `Error fetching details for stock ${stock.stockCode}:`,
                error
              );
              return null;
            }
          })
        );

        const filteredStocks = stockWithDetails.filter(
          (stock) => stock !== null
        ) as StockItemData[];

        console.log('최종 데이터:', filteredStocks); // 최종 데이터 확인
        setStocks(filteredStocks); // 상태에 저장
      } catch (error) {
        setError('주식 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    loadStockFavorites(); // 컴포넌트 렌더링 시 API 호출
  }, [limit]);

  const handleItemClick = (item: StockItemData) => {
    navigate(`/investment/stock/${item.stck_shrn_iscd}`, {
      state: { item },
    });
  };

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
          <div
            key={stock.stck_shrn_iscd}
            onClick={() => handleItemClick(stock)} // 클릭 시 디테일 페이지로 이동
            className="cursor-pointer"
          >
            <StockItem
              name={stock.hts_kor_isnm} // 주식 이름
              code={stock.stck_shrn_iscd} // 주식 코드
              price={stock.stck_prpr} // 주식 현재가
              percentageChange={parseFloat(stock.prdy_ctrt)} // 주식의 등락률
              weeklyPrices={stock.weeklyPrices} // 주간 가격 데이터
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
