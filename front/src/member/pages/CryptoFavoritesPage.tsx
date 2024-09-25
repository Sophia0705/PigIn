import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 임포트
import { FaArrowLeft } from 'react-icons/fa'; // 뒤로가기 아이콘 사용을 위한 react-icons 패키지 임포트
import CryptoList from '../components/CryptoList'; // 가상화폐 목록을 보여줄 컴포넌트 임포트

// CryptoFavoritesPage 컴포넌트 정의
const CryptoFavoritesPage: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  return (
    // 전체 페이지 레이아웃을 설정, 화면 높이와 배경색 설정
    <div className="dark:bg-gray-900 w-screen h-screen">
      {/* 페이지의 가로 너비를 고정하고 중앙에 배치 */}
      <div className="flex justify-between items-center p-2 bg-customDarkGreen">
        {/* 뒤로 가기 버튼을 배치 */}
        <button
          onClick={() => navigate(-1)} // 버튼 클릭 시 이전 페이지로 이동
          className="text-white bg-inherit pl-0"
        >
          <FaArrowLeft size={20} /> {/* 뒤로 가기 아이콘 */}
        </button>

        {/* 페이지 제목을 중앙에 배치 */}
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
          가상화폐 찜 목록
        </h1>

        {/* 가상화폐 목록을 표시, 제목은 숨김 */}
        <div className="overflow-x-hidden justify-center">
          <CryptoList showTitle={false} />{' '}
          {/* CryptoList 컴포넌트 호출, showTitle 속성을 false로 설정해 제목 숨김 */}
        </div>
      </div>
    </div>
  );
};

export default CryptoFavoritesPage;
