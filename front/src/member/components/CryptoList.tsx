// CryptoList 컴포넌트
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import CryptoItem from './CryptoItem'; // 개별 암호화폐 항목을 나타내는 컴포넌트
import CryptoData from '../data/CryptoData'; // 암호화폐 데이터를 불러옴

// CryptoList 컴포넌트의 props 타입 정의
interface CryptoListProps {
  limit?: number; // 리스트에 표시할 항목의 개수 (옵션)
  showTitle?: boolean; // 리스트 상단에 타이틀을 표시할지 여부 (옵션)
}

// CryptoList 컴포넌트 정의
const CryptoList: React.FC<CryptoListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  // 표시할 데이터를 limit 값에 따라 자름. limit가 있으면 해당 개수만큼 슬라이스
  const displayData = limit ? CryptoData.slice(0, limit) : CryptoData;

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mt-0 mb-0">
      {/* showTitle 값에 따라 타이틀과 "더 보기" 버튼을 표시 */}
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">
            가상화폐
          </h2>
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-4 py-1 hover:bg-gray-200"
              onClick={() => navigate('/crypto-favorites')} // "더 보기" 버튼 클릭 시 /crypto-favorites 페이지로 이동
            >
              더 보기
            </button>
          )}
        </div>
      )}
      {/* 암호화폐 데이터 목록을 렌더링. 각 항목은 CryptoItem으로 표시 */}
      <div className="p-0">
        {displayData.map((crypto) => (
          <CryptoItem
            key={crypto.symbol} // 각 암호화폐 항목의 고유 symbol을 key로 사용
            name={crypto.name} // 암호화폐 이름
            symbol={crypto.symbol} // 암호화폐 심볼
            price={crypto.price} // 현재 가격
            percentageChange={crypto.percentageChange} // 등락률
            weeklyPrices={crypto.weeklyPrices} // 일주일 동안의 가격 데이터
          />
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
