import React from 'react';
import { MdPlayArrow } from 'react-icons/md';
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import CustomTooltip from './CustomTooltip';

interface InvestmentCardProps {
  subject: string;
  title: string;
  value: string;
  percentageChange: string;
  headerColor: string;
  data: { name: string; value: number }[];
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  subject,
  title,
  value,
  percentageChange,
  headerColor,
  data,
}) => {
  const navigate = useNavigate();
  // 종목별 메인 페이지로 가는 로직
  const handleNavigation = () => {
    switch (title) {
      case 'KOSPI':
        navigate('/investment/stock');
        break;
      case 'BTC':
        navigate('/investment/cryptocurrency');
        break;
      case '국내 금':
        navigate('/investment/gold');
        break;
      default:
        break;
    }
  };

  // 데이터에서 마지막 이틀 가격 가져와서 비교
  const lastTwoValues = data.slice(-2);
  const [secondLastValue, lastValue] = lastTwoValues;

  // 이를 비율로 나타내서 퍼센티지로 환산
  const changeRatio =
    secondLastValue && lastValue
      ? ((lastValue.value - secondLastValue.value) / secondLastValue.value) *
        100
      : 0;

  // 이 비율이 양수라면...
  const isPositiveChange = changeRatio > 0;

  // 비율의 양수, 음수 여부에 따라 화살표 방향(위, 아래) 및 색깔(빨강, 파랑) 결정
  const arrowRotation = isPositiveChange ? '-rotate-90' : 'rotate-90';
  const arrowColor = isPositiveChange ? 'text-red-500' : 'text-blue-500';

  const percentageBgColor = isPositiveChange
    ? 'bg-red-500 bg-opacity-20'
    : 'bg-blue-500 bg-opacity-20';

  const strokeColor = isPositiveChange ? '#FF0000' : '#0000FF';
  const gradientId = `areaGradient-${subject}`;

  const values = data.map((entry) => entry.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const buffer = (maxValue - minValue) * 0.1;
  const domainMin = minValue - buffer;
  const domainMax = maxValue + buffer;

  return (
    <div className="bg-white w-11/12 rounded-lg shadow-md mb-2 mt-2">
      {/* 카드 헤더 */}
      <div
        className={`flex justify-between items-center px-2 py-1 rounded-t-lg ${headerColor}`}
      >
        <h3 className="text-white text-md font-bold">{subject}</h3>
        <button
          onClick={handleNavigation}
          className="text-white text-xs bg-transparent"
        >
          ▶
        </button>
      </div>
      {/* 카드 내용 */}
      <div className="flex flex-col items-start p-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg text-black font-semibold">{title}</div>
          <div className="text-lg text-black font-semibold">{value}</div>
        </div>
        <div className="flex justify-end w-full mt-1">
          <span
            className={`${percentageBgColor} text-xs text-gray-500 rounded-full px-2 py-1 flex items-center`}
          >
            <MdPlayArrow className={`mr-1 ${arrowRotation} ${arrowColor}`} />
            {percentageChange}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={data}>
            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  style={{ stopColor: strokeColor, stopOpacity: 0.4 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: strokeColor, stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>
            {/* x축, y축 설정 */}
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[domainMin, domainMax]} />
            <Tooltip content={<CustomTooltip />} />
            {/* 선 아래 그라데이션 영역 */}
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InvestmentCard;
