import React from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'; // 주식 등락률을 표시하기 위한 아이콘
import Graph from './Graph'; // 주간 주식 가격 변동을 시각화하는 그래프 컴포넌트

// StockItem 컴포넌트의 props 타입 정의
interface StockItemProps {
  name: string; // 주식 이름
  code: string; // 주식 코드
  price: number; // 주식 가격
  percentageChange: string; // 주식 등락률 (ex: +1.23%)
  weeklyPrices: number[]; // 주식의 주간 가격 데이터 배열
}

// 주식 항목을 시각적으로 보여주는 StockItem 컴포넌트
const StockItem: React.FC<StockItemProps> = ({
  name,
  code,
  price,
  percentageChange,
  weeklyPrices,
}) => {
  const isPositiveChange = percentageChange.startsWith('+'); // 등락률이 '+'로 시작하는지 여부 확인
  const isNegativeChange = percentageChange.startsWith('-'); // 등락률이 '-'로 시작하는지 여부 확인

  // 그래프의 색상을 등락률에 따라 결정
  const graphColor = isNegativeChange
    ? '#FF0000' // 하락 시 빨간색
    : isPositiveChange
      ? '#00FF00' // 상승 시 초록색
      : '#808080'; // 변동 없을 때 회색

  // 주식 이름이 너무 길 경우 자르기
  const truncatedName = name.length > 10 ? name.slice(0, 10) + '...' : name;
  const truncatedCode = code.length > 10 ? code.slice(0, 10) + '...' : code;

  return (
    <div className="flex justify-between items-center p-0 border-b pt-0 pb-0">
      {/* 주식 이름 및 코드 표시 */}
      <div className="flex flex-col basis-2/5 min-w-[100px] text-left">
        <span className="font-bold text-gray-900 truncate">
          {truncatedName} {/* 잘린 주식 이름 */}
        </span>
        <span className="text-sm text-gray-500 truncate">
          {truncatedCode} {/* 잘린 주식 코드 */}
        </span>
      </div>

      {/* 주간 가격 변동 그래프 표시 */}
      <div className="flex justify-center items-center basis-1/5 min-w-[100px]">
        <Graph data={weeklyPrices} color={graphColor} />{' '}
        {/* 그래프 컴포넌트 호출 */}
      </div>

      {/* 주식 가격 및 등락률 표시 */}
      <div className="text-right basis-2/5 min-w-[100px]">
        <p className="font-bold text-gray-900 text-xs">
          {price.toLocaleString()} 원
        </p>

        {/* 등락률 표시 (색상 및 아이콘 포함) */}
        <p
          className="flex items-center justify-end text-sm"
          style={{ color: graphColor }} // 텍스트 색상을 등락률에 맞게 설정
        >
          {isPositiveChange ? (
            <MdArrowDropUp /> // 상승일 경우 위쪽 화살표 아이콘 표시
          ) : isNegativeChange ? (
            <MdArrowDropDown /> // 하락일 경우 아래쪽 화살표 아이콘 표시
          ) : null}
          {percentageChange} {/* 등락률 표시 */}
        </p>
      </div>
    </div>
  );
};

export default StockItem;
