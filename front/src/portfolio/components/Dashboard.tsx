import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A', '#FF6B6B'];

interface viewBoxType {
  cx: number;
  cy: number;
}

interface CustomLabelProps {
  viewBox?: viewBoxType;
  totalValue: number;
  totalProfit: number;
  totalProfitRate: number;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox = { cx: 0, cy: 0 }, // 기본값으로
  totalValue,
  totalProfit,
  totalProfitRate,
}) => {
  const { cx, cy } = viewBox;

  return (
    <g>
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
        ({(totalProfitRate * 100).toFixed(2)}%{totalProfit >= 0 ? '▲' : '▼'})
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
    isLoading,
    error,
  } = usePortfolioStore();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  const totalProfitRate =
    categories.reduce(
      (sum, category) =>
        sum +
        category.items.reduce((catSum, item) => catSum + item.profitRate, 0),
      0
    ) / categories.reduce((sum, category) => sum + category.items.length, 0);

  const totalProfit = totalValue * totalProfitRate;

  return (
    <div className="bg-white h-full rounded-lg p-4">
      <h2 className="text-3xl font-bold mb-2">My Portfolio</h2>
      <p className="text-sm text-gray-500 mb-1">
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
                onClick={(_, index) => setActiveIndex(index)}
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
                    />
                  }
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-8">
          {categories.map((category, index) => {
            // const categoryProfitRate =
            //   category.items.reduce((sum, item) => sum + item.profitRate, 0) /
            //   category.items.length;
            return (
              <div
                key={category.name}
                className="mb-2" // 각 카테고리 항목 사이의 간격
              >
                <div className="flex items-center mb-1">
                  {/* 색상 원과 카테고리 이름을 포함하는 상단 줄 */}
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {category.name}
                  </span>{' '}
                </div>
                <div className="pl-5 text-sm">
                  <span className="">
                    {((category.totalValue / totalValue) * 100).toFixed(1)}%{' '}
                  </span>
                  <span className="ml-2">
                    ({category.totalValue.toLocaleString()}원)
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

export default Dashboard;
