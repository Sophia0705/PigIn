import React from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'; // 상승 및 하락 아이콘
import Graph from './Graph'; // Graph 컴포넌트 재사용

// CryptoItem 컴포넌트의 props 타입 정의
interface CryptoItemProps {
  name: string; // 암호화폐 이름
  symbol: string; // 암호화폐 심볼
  price: number; // 현재 가격
  percentageChange: string; // 등락률 (퍼센트)
  weeklyPrices: number[]; // 일주일 동안의 가격 데이터를 배열로 받음
}

// CryptoItem 컴포넌트 정의
const CryptoItem: React.FC<CryptoItemProps> = ({
  name,
  symbol,
  price,
  percentageChange,
  weeklyPrices,
}) => {
  // 등락률에 따라 상승인지 하락인지 판단
  const isPositiveChange = percentageChange.startsWith('+'); // 상승률이 +로 시작하는지 확인
  const isNegativeChange = percentageChange.startsWith('-'); // 하락률이 -로 시작하는지 확인

  // 그래프의 색상을 등락률에 따라 설정 (양의 변화는 초록색, 음의 변화는 빨간색, 그 외는 회색)
  const graphColor = isNegativeChange
    ? '#FF0000' // 빨간색: 하락
    : isPositiveChange
      ? '#00FF00' // 초록색: 상승
      : '#808080'; // 회색: 변화 없음

  // 암호화폐 이름과 심볼이 너무 길 경우 자름
  const truncatedName = name.length > 10 ? name.slice(0, 10) + '...' : name; // 이름을 10글자로 제한하고 그 이상일 경우 '...' 추가
  const truncatedSymbol =
    symbol.length > 10 ? symbol.slice(0, 10) + '...' : symbol; // 심볼을 10글자로 제한

  return (
    <div className="flex justify-between items-center p-0 border-b pt-1 pb-1">
      {/* 암호화폐 이름과 심볼 출력 */}
      <div className="flex flex-col basis-2/5 min-w-[100px] text-left">
        <span className="font-bold text-gray-900 truncate">
          {truncatedName} {/* 자른 이름을 출력 */}
        </span>
        <span className="text-sm text-gray-500 truncate">
          {truncatedSymbol} {/* 자른 심볼을 출력 */}
        </span>
      </div>

      {/* Graph 컴포넌트: 일주일 가격 데이터를 표시 */}
      <div className="flex justify-center items-center basis-1/5 min-w-[100px]">
        <Graph data={weeklyPrices} color={graphColor} />{' '}
        {/* 그래프 색상을 전달 */}
      </div>

      {/* 가격 및 등락률 표시 */}
      <div className="text-right basis-2/5 min-w-[100px]">
        <p className="font-bold text-gray-900 text-xs">
          {price.toLocaleString()} USD {/* 가격을 통화 형식으로 출력 */}
        </p>
        <p
          className="flex items-center justify-end text-sm"
          style={{ color: graphColor }} // 등락률에 따른 색상 적용
        >
          {isPositiveChange ? ( // 상승이면 상승 화살표 아이콘
            <MdArrowDropUp />
          ) : isNegativeChange ? ( // 하락이면 하락 화살표 아이콘
            <MdArrowDropDown />
          ) : null}
          {percentageChange} {/* 등락률 출력 */}
        </p>
      </div>
    </div>
  );
};

export default CryptoItem;
