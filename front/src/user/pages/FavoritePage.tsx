import React from 'react';
import StockList from '../components/StockList'; // 주식 목록 컴포넌트를 가져옴

// '찜 목록' 페이지를 렌더링하는 컴포넌트
const FavoritePage: React.FC = () => {
  return (
    // 배경색과 패딩을 가진 페이지 컨테이너
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {/* 페이지 타이틀. 중앙 정렬 및 큰 글씨로 설정 */}
      <h2 className="text-2xl text-center mb-6 text-white">찜 목록</h2>
      {/* 주식 목록을 렌더링 */}
      <StockList />
    </div>
  );
};

export default FavoritePage;
