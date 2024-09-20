import React from 'react';
import StockItem from './StockItem'; // 개별 주식 항목 컴포넌트
import StockData from '../data/StockData'; // StockData.ts에서 정의된 더미 주식 데이터를 가져옴

// 주식 목록을 렌더링하는 컴포넌트
const StockList: React.FC = () => {
  return (
    // 주식 목록을 담는 컨테이너. 흰색 배경과 그림자 스타일 추가
    <div className="bg-white rounded-lg shadow-md mb-0">
      <div className="flex justify-between items-center mb-0">
        {/* 왼쪽 상단 "주식" */}
        <h2 className="text-3xl font-bold text-gray-900 ml-2">주식</h2>

        {/* 오른쪽 상단 "더보기" 버튼 */}
        <button className="text-sm text-gray-500 border border-gray-300 rounded-full px-4 py-1 hover:bg-gray-200">
          더 보기
        </button>
      </div>
      {/* StockData 배열을 순회하면서 각 주식 항목을 StockItem으로 렌더링 */}
      {StockData.map((stock) => (
        <StockItem
          key={stock.stck_shrn_iscd} // 주식의 고유 코드를 키로 사용
          name={stock.hts_kor_isnm} // 주식의 이름을 props로 전달
          code={stock.stck_shrn_iscd} // 주식의 코드를 props로 전달
          price={stock.stck_prpr} // 현재 주식 가격을 props로 전달
          percentageChange={stock.prdy_ctrt} // 주식의 일일 등락률을 props로 전달
          weeklyPrices={stock.weeklyPrices} // 주간 가격 데이터를 props로 전달
        />
      ))}
    </div>
  );
};

export default StockList;
