import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가
import { FaArrowLeft } from 'react-icons/fa'; // 아이콘 사용을 위한 패키지
import CryptoList from '../components/CryptoList'; // 가상화폐 목록 컴포넌트

const CryptoFavoritesPage: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 사용

  return (
    <div className="p-0 dark:bg-gray-900 w-full h-[915px]">
      {/* w-[412px]로 가로 크기를 고정하고 mx-auto로 가운데 정렬 */}
      <div className="flex justify-between items-center w-full p-2 bg-customDarkGreen">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-inherit pl-0"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          가상화폐 찜 목록
        </h1>
      </div>
      {/* 가상화폐 목록을 전체 렌더링, 제목 숨기기 */}
      <div className="overflow-x-hidden w-full">
        <CryptoList showTitle={false} />
      </div>
    </div>
  );
};

export default CryptoFavoritesPage;
