import React from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import Graph from './Graph'; // 그래프 컴포넌트 재사용

interface CryptoItemProps {
  name: string;
  symbol: string;
  price: number;
  percentageChange: string;
  weeklyPrices: number[];
}

const CryptoItem: React.FC<CryptoItemProps> = ({
  name,
  symbol,
  price,
  percentageChange,
  weeklyPrices,
}) => {
  const isPositiveChange = percentageChange.startsWith('+');
  const isNegativeChange = percentageChange.startsWith('-');

  // 그래프 색상을 등락률에 따라 결정
  const graphColor = isNegativeChange
    ? '#FF0000' // 빨간색
    : isPositiveChange
      ? '#00FF00' // 초록색
      : '#808080'; // 회색

  // 텍스트 자르기 설정 (최대 길이 설정 가능)
  const truncatedName = name.length > 10 ? name.slice(0, 10) + '...' : name;
  const truncatedSymbol =
    symbol.length > 10 ? symbol.slice(0, 10) + '...' : symbol;

  return (
    <div className="flex justify-between items-center p-0 border-b pt-1 pb-1">
      <div className="flex flex-col basis-2/5 min-w-[100px] text-left">
        <span className="font-bold text-gray-900 truncate">
          {truncatedName}
        </span>
        <span className="text-sm text-gray-500 truncate">
          {truncatedSymbol}
        </span>
      </div>

      <div className="flex justify-center items-center basis-1/5 min-w-[100px]">
        {/* Graph 컴포넌트에 그래프 색상 전달 */}
        <Graph data={weeklyPrices} color={graphColor} />
      </div>

      <div className="text-right basis-2/5 min-w-[100px]">
        <p className="font-bold text-gray-900 text-xs">
          {price.toLocaleString()} USD
        </p>
        <p
          className="flex items-center justify-end text-sm"
          style={{ color: graphColor }}
        >
          {isPositiveChange ? (
            <MdArrowDropUp />
          ) : isNegativeChange ? (
            <MdArrowDropDown />
          ) : null}
          {percentageChange}
        </p>
      </div>
    </div>
  );
};

export default CryptoItem;
