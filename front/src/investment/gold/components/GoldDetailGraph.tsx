import React from 'react';
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import CustomTooltip from '../../components/CustomTooltip';

interface GoldDetailGraphProps {
  chartData: { name: string; value: number }[];
  adjustedMin: number;
  adjustedMax: number;
}

const GoldDetailGraph: React.FC<GoldDetailGraphProps> = ({
  chartData,
  adjustedMin,
  adjustedMax,
}) => {
  return (
    <div className="w-fit mx-auto">
      <div className="w-[350px] h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32CD32" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#32CD32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={[adjustedMin, adjustedMax]} hide />
            <XAxis dataKey="name" hide />
            <Tooltip cursor={false} content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#32CD32"
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GoldDetailGraph;
