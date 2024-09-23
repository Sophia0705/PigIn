import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CryptoDetailGraphProps {
  chartData: { name: string; value: number }[];
  adjustedMin: number;
  adjustedMax: number;
}

const CryptoDetailGraph: React.FC<CryptoDetailGraphProps> = ({
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
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "none",
              }}
              labelStyle={{ color: "#333" }}
              itemStyle={{ color: "#333" }}
            />
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

export default CryptoDetailGraph;
