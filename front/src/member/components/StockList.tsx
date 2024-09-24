// StockList
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import StockItem from './StockItem'; // 개별 주식 항목을 표시하는 컴포넌트
import StockData from '../data/StockData'; // 주식 데이터 가져오기

// StockList 컴포넌트의 props 타입 정의
interface StockListProps {
  limit?: number; // 표시할 주식 항목의 최대 개수 (선택적)
  showTitle?: boolean; // 제목과 "더 보기" 버튼 표시 여부 (기본값은 true)
}

// 주식 목록을 보여주는 StockList 컴포넌트
const StockList: React.FC<StockListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const displayData = limit ? StockData.slice(0, limit) : StockData; // limit가 있으면 그만큼 데이터 자르기

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mt-0 mb-0">
      {/* 주식 목록의 상단 제목 및 "더 보기" 버튼 */}
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">주식</h2>
          {/* limit가 있는 경우 "더 보기" 버튼을 추가 */}
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-4 py-1 hover:bg-gray-200"
              onClick={() => navigate('/stock-favorites')} // '더 보기' 버튼 클릭 시 stock-favorites 페이지로 이동
            >
              더 보기
            </button>
          )}
        </div>
      )}

      {/* 주식 항목을 리스트로 표시 */}
      <div className="p-0">
        {displayData.map((stock) => (
          <StockItem
            key={stock.stck_shrn_iscd} // 고유한 주식 ID를 key로 설정
            name={stock.hts_kor_isnm} // 주식 이름
            code={stock.stck_shrn_iscd} // 주식 코드
            price={stock.stck_prpr} // 주식 현재가
            percentageChange={stock.prdy_ctrt} // 주식의 등락률
            weeklyPrices={stock.weeklyPrices} // 주식의 주간 가격 변동 데이터
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;
