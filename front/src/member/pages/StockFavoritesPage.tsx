import React from 'react';
import StockList from '../components/StockList'; // 주식 목록 컴포넌트

const StockFavoritesPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex justify-between items-center w-screen pt-10 bg-customDarkGreen">
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 pb-2">
          주식 찜 전체 목록
        </h1>
      </div>
      {/* 찜한 주식 목록만 렌더링*/}
      <div className="mt-6">
        <StockList limit={20} showTitle={false} />
      </div>
    </div>
  );
};

export default StockFavoritesPage;
