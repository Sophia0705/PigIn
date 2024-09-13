import React from "react";
import { AreaChart, XAxis, YAxis, ResponsiveContainer, Area } from "recharts";
import { MdPlayArrow } from "react-icons/md";

interface CryptoItemProps {
  name: string;
  price: number;
  percentageChange: string;
  data: { name: string; value: number }[];
}

const CryptoItem: React.FC<CryptoItemProps> = ({
  name,
  price,
  percentageChange,
  data,
}) => {
  const isPositiveChange = percentageChange.startsWith("+");
  const changeColor = isPositiveChange ? "bg-green-500" : "bg-red-500";
  const arrowRotation = isPositiveChange ? "-rotate-90" : "rotate-90";

  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="bg-customDarkGreen rounded-xl p-4 w-50 h-60 mt-8 shadow-md flex-shrink-0">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white text-lg font-bold">{name}</h3>
          <p className="text-white text-2xl font-bold">
            {price.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex items-center justify-center ${changeColor} bg-opacity-20 rounded-full px-2 py-1`}
        >
          <MdPlayArrow className={`mr-1 ${arrowRotation} text-green-500`} />
          <span className="text-white text-sm">{percentageChange}</span>
        </div>
      </div>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32CD32" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#32CD32" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis domain={[minValue - padding, maxValue + padding]} hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#32CD32"
              fill="url(#colorGreen)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoItem;
