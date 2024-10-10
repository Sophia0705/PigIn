import React from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import Graph from './Graph';

interface CryptoItemProps {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  weeklyPrices: number[];
  monthlyPrices: number[];
  yearlyPrices: number[];
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

const CryptoItem: React.FC<CryptoItemProps> = ({
  name,
  symbol,
  price,
  priceChange,
  weeklyPrices,
  monthlyPrices,
  yearlyPrices,
  open,
  close,
  high,
  low,
  volume,
}) => {
  console.log('CryptoItem Props:', {
    name,
    symbol,
    price,
    priceChange,
    weeklyPrices,
    monthlyPrices,
    yearlyPrices,
    open,
    close,
    high,
    low,
    volume,
  });

  const truncatedName = name.length > 10 ? `${name.slice(0, 10)}...` : name;
  const truncatedSymbol =
    symbol.length > 10 ? `${symbol.slice(0, 10)}...` : symbol;

  // 주간 데이터를 사용한 변동률 계산 (배열 순서 유지)
  const latestValue = weeklyPrices.length
    ? weeklyPrices[weeklyPrices.length - 1]
    : 0;
  const previousValue =
    weeklyPrices.length > 1 ? weeklyPrices[weeklyPrices.length - 2] : 0;
  const percentageChange = previousValue
    ? ((latestValue - previousValue) / previousValue) * 100
    : 0;
  const formattedPercentageChange = Math.abs(percentageChange).toFixed(2) + '%';

  const isPositiveWeeklyChange = percentageChange > 0;
  const isNegativeWeeklyChange = percentageChange < 0;

  // 그래프와 텍스트의 색상 설정
  const color = isNegativeWeeklyChange
    ? '#FF0000' // 하락: 빨간색
    : isPositiveWeeklyChange
      ? '#00FF00' // 상승: 초록색
      : '#808080'; // 변동 없음: 회색

  // 아이콘 설정 (변동이 없을 때는 아이콘을 표시하지 않음)
  const icon = isPositiveWeeklyChange ? (
    <MdArrowDropUp />
  ) : isNegativeWeeklyChange ? (
    <MdArrowDropDown />
  ) : null;

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
        <Graph
          data={weeklyPrices.slice().reverse()} // weeklyPrices 배열을 뒤집어서 전달
          color={color} // 그래프 색상 설정
        />
      </div>

      <div className="text-right basis-2/5 min-w-[100px]">
        <p className="font-bold text-gray-900 text-xs">
          {price.toLocaleString()} 원
        </p>
        <p className="flex items-center justify-end text-sm" style={{ color }}>
          {icon}
          {formattedPercentageChange}
        </p>
      </div>
    </div>
  );
};

export default CryptoItem;
