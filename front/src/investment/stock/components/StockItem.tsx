import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';

interface StockItemProps {
  name: string;
  price: number;
  percentageChange: string;
  weeklyPrices: number[];
  monthlyPrices: number[];
  yearlyPrices: number[];
}

const StockItem: React.FC<StockItemProps> = ({
  name,
  price,
  percentageChange,
  weeklyPrices,
}) => {
  const countZeros = (str: string): number => {
    return (str.match(/0/g) || []).length;
  };

  const isNegativeChange = percentageChange.startsWith('-');
  const isZeroChange = countZeros(percentageChange) === 3;
  const chartData = weeklyPrices.map((value, index) => ({
    name: `Day ${index + 1}`,
    value,
  }));

  const minValue = Math.min(...weeklyPrices);
  const maxValue = Math.max(...weeklyPrices);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="bg-customDarkGreen rounded-xl p-4 w-50 h-60 mt-8 shadow-md flex-shrink-0">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <span
          className={`flex items-center justify-center text-xs rounded-full px-2 py-1 ${
            isNegativeChange
              ? 'bg-green-100 text-customDarkGreen'
              : isZeroChange
                ? 'bg-gray-300 text-gray-700'
                : 'bg-green-900 text-white'
          }`}
        >
          {isZeroChange ? (
            <span></span>
          ) : isNegativeChange ? (
            <MdArrowDropDown />
          ) : (
            <MdArrowDropUp />
          )}
          {percentageChange} %
        </span>
      </div>
      <div className="text-white font-bold text-2xl mb-2">
        {price.toLocaleString()}
      </div>

      {/* 그래프 */}
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#32CD32" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#32CD32" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis domain={[minValue - padding, maxValue + padding]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#32CD32"
            fill="url(#colorStock)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockItem;
