import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 추가
import { FaArrowLeft } from 'react-icons/fa'; // 뒤로 가기 버튼에 사용할 아이콘 추가
import StockList from '../components/StockList'; // 주식 목록을 가져오는 컴포넌트 불러오기

// 주식 찜 목록 페이지 컴포넌트
const StockFavoritesPage: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  return (
    <div className="dark:bg-gray-900 w-screen h-screen">
      {/* 상단 바: 뒤로 가기 버튼과 페이지 제목 */}
      <div className="flex justify-between items-center w-full p-2 bg-customDarkGreen">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)} // 이전 페이지로 돌아가는 함수 호출
          className="text-white bg-inherit pl-0"
        >
          <FaArrowLeft size={20} /> {/* 뒤로 가기 아이콘 */}
        </button>
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          주식 찜 목록
        </h1>
      </div>
      {/* 주식 목록을 전체 렌더링, 제목은 숨기기 */}
      <div className="overflow-x-hidden w-full">
        <StockList showTitle={false} />{' '}
        {/* 주식 목록 컴포넌트를 제목 없이 렌더링 */}
      </div>
    </div>
  );
};

export default StockFavoritesPage;
