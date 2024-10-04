import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A', '#FF6B6B'];

interface CustomLabelProps {
  viewBox?: { cx: number; cy: number };
  totalValue: number;
  totalProfit: number;
  totalProfitRate: number;
  onClick: () => void;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox = { cx: 0, cy: 0 },
  totalValue,
  totalProfit,
  totalProfitRate,
  onClick,
}) => {
  const { cx, cy } = viewBox;
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* 가운데 금액 & 퍼센트 --> 이거 클릭하면 전체 목록으로 나오게! */}
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold"
      >
        {totalValue.toLocaleString()}원
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        dominantBaseline="central"
        className={`text-sm font-semibold ${totalProfit >= 0 ? 'fill-green-500' : 'fill-red-500'}`}
      >
        {totalProfit >= 0 ? '+' : '-'}
        {Math.abs(totalProfit).toLocaleString()}원
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        dominantBaseline="central"
        className={`text-sm font-semibold ${totalProfit >= 0 ? 'fill-green-500' : 'fill-red-500'}`}
      >
        ({totalProfitRate.toFixed(2)}%{totalProfit >= 0 ? '▲' : '▼'})
      </text>
    </g>
  );
};

const Dashboard: React.FC = () => {
  const {
    categories,
    totalValue,
    activeIndex,
    setActiveIndex,
    setShowAllItems,
    isLoading,
    error,
  } = usePortfolioStore();

  const calculatePortfolioMetrics = useMemo(() => {
    const calculateCategoryInitialInvestment = (items: any[]) =>
      items.reduce((sum, item) => {
        const currentValue = item.quantity * item.price;
        const initialInvestment = currentValue / (1 + item.profitRate);
        return sum + initialInvestment;
      }, 0);

    const totalInitialInvestment = categories.reduce(
      (sum, category) =>
        sum + calculateCategoryInitialInvestment(category.items),
      0
    );

    const totalProfit = totalValue - totalInitialInvestment;
    const totalProfitRate = (totalProfit / totalInitialInvestment) * 100;

    return { totalProfit, totalProfitRate };
  }, [categories, totalValue]);

  const handleCenterClick = () => {
    setShowAllItems(true);
    setActiveIndex(undefined);
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  const { totalProfit, totalProfitRate } = calculatePortfolioMetrics;

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <h2 className="text-3xl font-bold font-rix-reg mb-2">My Portfolio</h2>
      <p className="text-base text-gray-500 mb-1">
        투자 항목을 보고싶으면 그래프를 눌러주세요.
      </p>
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="totalValue"
                onClick={(_, index) => {
                  setActiveIndex(index);
                  setShowAllItems(false);
                }}
              >
                {categories.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? '#000' : 'none'}
                    strokeWidth={2}
                  />
                ))}
                <Label
                  content={
                    <CustomLabel
                      totalValue={totalValue}
                      totalProfit={totalProfit}
                      totalProfitRate={totalProfitRate}
                      onClick={handleCenterClick}
                    />
                  }
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-8">
          {categories.map((category, index) => (
            <div key={category.name} className="mb-2">
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-gray-700 text-base font-normal">
                  {category.name}
                </span>
              </div>
              <div className="pl-3 font-medium text-base">
                <span className="">
                  {((category.totalValue / totalValue) * 100).toFixed(1)}%{' '}
                </span>
                <span className="font-medium">
                  ({category.totalValue.toLocaleString()}원)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
