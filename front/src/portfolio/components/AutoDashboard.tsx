import { useMemo } from 'react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A', '#FF6B6B'];

interface CustomLabelProps {
  viewBox?: { cx: number; cy: number };
  totalValue: number;
}

const CustomLabel = ({
  viewBox = { cx: 0, cy: 0 },
  totalValue,
}: CustomLabelProps) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold"
      >
        {totalValue.toLocaleString()}원
      </text>
    </g>
  );
};

const AutoDashboard = () => {
  const { investmentAmount, allocations } = useAutoInvestmentStore();

  const chartData = useMemo(() => {
    return Object.entries(allocations).map(([category, items]) => ({
      name: category,
      value: items.reduce(
        (sum, item) => sum + (item.percentage / 100) * investmentAmount,
        0
      ),
    }));
  }, [allocations, investmentAmount]);

  return (
    <div className="bg-white h-full rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={250}>
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
                  content={<CustomLabel totalValue={investmentAmount} />}
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-8">
          {chartData.map((category, index) => (
            <div key={category.name} className="mb-2">
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-gray-700 text-sm font-medium">
                  {category.name}
                </span>
              </div>
              <div className="pl-5 text-sm">
                <span className="">
                  {((category.value / investmentAmount) * 100).toFixed(1)}%{' '}
                </span>
                <span className="ml-2">
                  ({category.value.toLocaleString()}원)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoDashboard;
