import React from 'react';
import StockList from '../components/StockList'; // 주식 목록 컴포넌트
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StockFavoritesPage: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  return (
    <div className="p-0 dark:bg-gray-900 w-full h-full">
      {/* 페이지의 가로 너비를 고정하고 중앙에 배치 */}
      <div className="flex justify-between items-center w-full p-7 pb-2 bg-customDarkGreen">
        {/* 뒤로 가기 버튼을 배치 */}
        <button
          onClick={() => navigate(-1)} // 버튼 클릭 시 이전 페이지로 이동
          className="text-white bg-inherit pl-0"
        >
          <FaArrowLeft size={20} /> {/* 뒤로 가기 아이콘 */}
        </button>

        {/* 페이지 제목을 중앙에 배치 */}
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          주식 찜 전체 목록
        </h1>
      </div>

      {/* 찜한 주식 목록만 렌더링 */}
      <div className="mt-6">
        <StockList limit={20} showTitle={false} />
      </div>
    </div>
  );
};

export default StockFavoritesPage;
