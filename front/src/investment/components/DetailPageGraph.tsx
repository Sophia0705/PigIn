import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { MdPlayArrow } from "react-icons/md";

interface DetailPageGraphProps {
  data: { name: string; value: number }[];
  subject: string;
  value: string;
  percentageChange: string;
}

const DetailPageGraph: React.FC<DetailPageGraphProps> = ({
  data,
  subject,
  value,
  percentageChange,
}) => {
  const strokeColor = "#32CD32";
  const gradientId = `detailPageGradient-${subject}`;

  const isPositiveChange = percentageChange.startsWith("+");

  const arrowRotation = isPositiveChange ? "-rotate-90" : "rotate-90";
  const arrowColor = "text-green-600";

  const values = data.map((entry) => entry.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const buffer = (maxValue - minValue) * 0.1;
  const domainMin = minValue - buffer;
  const domainMax = maxValue + buffer;

  return (
    <div className="w-full">
      {/* 정보 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mb-1 ml-2">
          {subject}
        </h2>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold text-white mt-5 mr-5">
            {value}
          </span>
          <span className="flex items-center justify-center mt-1 bg-green-900 rounded-full p-1 mr-3">
            <MdPlayArrow className={`${arrowRotation} ${arrowColor}`} />
            <span className="text-white text-sm">{percentageChange}</span>
          </span>
        </div>
      </div>
      {/* 그래프 */}
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart data={data}>
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
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[domainMin, domainMax]} />
          <Tooltip />
          {/* 그라데이션 */}
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
  );
};

export default DetailPageGraph;
