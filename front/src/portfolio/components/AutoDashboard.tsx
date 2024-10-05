import { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A', '#FF6B6B'];

interface ViewBox {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  width: number;
  height: number;
}

const AutoDashboard: React.FC = () => {
  const { investmentAmount, allocations } = useAutoInvestmentStore();
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const newChartData = Object.entries(allocations).map(
      ([category, items]) => {
        const categoryTotal = items.reduce(
          (sum, item) => sum + (item.percentage / 100) * investmentAmount,
          0
        );
        return { name: category, value: categoryTotal };
      }
    );

    setChartData(newChartData);
  }, [allocations, investmentAmount]);

  const totalValue = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return total;
  }, [chartData]);

  if (chartData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white h-3/7 rounded-lg p-4 w-[95%] mx-auto">
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox as ViewBox;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        fill="#000000"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          dy="-0.5em"
                          fontSize="20"
                          fontWeight="bold"
                        >
                          {totalValue.toLocaleString()}원
                        </tspan>
                      </text>
                    );
                  }}
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-8">
          {chartData.map((category, index) => {
            const percentage =
              totalValue > 0
                ? ((category.value / totalValue) * 100).toFixed(1)
                : '0.0';
            return (
              <div key={category.name} className="mb-2">
                <div className="flex items-center mb-1">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    {category.name}
                  </span>
                </div>
                <div className="pl-5 text-black text-base">
                  <span>{percentage}% </span>
                  <span className="ml-2">
                    ({category.value.toLocaleString()}원)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AutoDashboard;
