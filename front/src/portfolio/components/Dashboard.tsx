import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { usePortfolioStore } from "../../store/portfolioStore";

const COLORS = ["#BBF5E2", "#6183EE", "#ECCD4A", "#FF6B6B"];

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">My Portfolio</h2>
      <p className="text-sm text-gray-500 mb-4">
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
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? "#000" : "none"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {totalValue.toLocaleString()}원
            </p>
            <p
              className={`text-lg ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {totalProfit >= 0 ? "+" : "-"}
              {Math.abs(totalProfit).toLocaleString()}원 (
              {(totalProfitRate * 100).toFixed(2)}%
              {totalProfit >= 0 ? "↑" : "↓"})
            </p>
          </div>
        </div>
        <div className="w-1/2 pl-8">
          {categories.map((category, index) => {
            const categoryProfitRate =
              category.items.reduce((sum, item) => sum + item.profitRate, 0) /
              category.items.length;
            return (
              <div
                key={category.name}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{category.name}</span>
                </div>
                <span
                  className={`font-bold ${categoryProfitRate >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {((category.totalValue / totalValue) * 100).toFixed(0)}% (
                  {category.totalValue.toLocaleString()}원){" "}
                  {categoryProfitRate >= 0 ? "↑" : "↓"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
