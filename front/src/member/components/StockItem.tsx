import React from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import Graph from './Graph'; // 기존 Graph 컴포넌트 사용

interface StockItemProps {
  name: string; // 주식 이름
  code: string; // 주식 코드
  price: number | string; // 주식 가격 (문자열일 수도 있으니 string도 추가)
  percentageChange: number; // 주식 등락률
  weeklyPrices: number[]; // 주식의 주간 가격 데이터
}

const StockItem: React.FC<StockItemProps> = ({
  name,
  code,
  price,
  percentageChange,
  weeklyPrices,
}) => {
  const isPositiveChange = percentageChange > 0; // 등락률이 0보다 큰지 여부 확인
  const isNegativeChange = percentageChange < 0; // 등락률이 0보다 작은지 여부 확인

  // 그래프의 색상 설정
  const graphColor = isNegativeChange
    ? '#FF0000' // 하락: 빨간색
    : isPositiveChange
      ? '#00FF00' // 상승: 초록색
      : '#808080'; // 변동 없음: 회색

  // 주식 이름이 너무 길 경우 자르기
  const truncatedName = name.length > 10 ? name.slice(0, 10) + '...' : name;
  const truncatedCode = code.length > 10 ? code.slice(0, 10) + '...' : code;

  // 그래프 데이터를 뒤집기 위해 weeklyPrices 배열을 reverse 처리
  const reversedWeeklyPrices = [...weeklyPrices].reverse(); // 원본 배열을 변경하지 않기 위해 spread 연산자 사용

  // price 값을 숫자로 변환 후 쉼표 처리
  const formattedPrice = typeof price === 'string' ? parseFloat(price) : price;

  // 디버깅을 위한 로그
  // console.log('Stock Name:', name);
  // console.log('Stock Code:', code);
  // console.log('Price:', formattedPrice.toLocaleString()); // 여기서도 확인

  return (
    <div className="flex justify-between items-center p-0 border-b pt-0 pb-0">
      {/* 주식 이름 및 코드 표시 */}
      <div className="flex flex-col basis-2/5 min-w-[100px] text-left">
        <span className="font-bold text-gray-900 truncate">
          {truncatedName}
        </span>
        <span className="text-sm text-gray-500 truncate">{truncatedCode}</span>
      </div>

      {/* 그래프 표시 (weeklyPrices를 reversedWeeklyPrices로 변경) */}
      <div className="flex justify-center items-center basis-1/5 min-w-[100px]">
        <Graph data={reversedWeeklyPrices} color={graphColor} />{' '}
        {/* 그래프 컴포넌트 사용 */}
      </div>

      {/* 주식 가격 및 등락률 표시 */}
      <div className="text-right basis-2/5 min-w-[100px]">
        <p className="font-bold text-gray-900 text-xs">
          {formattedPrice.toLocaleString()} 원{' '}
          {/* 천 단위 쉼표 추가 후 '원' 텍스트 추가 */}
        </p>

        {/* 등락률 표시 (아이콘 및 색상 포함) */}
        <p
          className="flex items-center justify-end text-sm"
          style={{ color: graphColor }}
        >
          {isPositiveChange ? (
            <MdArrowDropUp />
          ) : isNegativeChange ? (
            <MdArrowDropDown />
          ) : null}
          {percentageChange}%
        </p>
      </div>
    </div>
  );
};

export default StockItem;
