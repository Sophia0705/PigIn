import { useMemo } from 'react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A', '#FF6B6B'];

interface CustomLabelProps {
  viewBox?: { cx: number; cy: number };
  totalPrice: number;
  totalProfitRate: number;
  onClick: () => void;
}

const CustomLabel = ({
  viewBox = { cx: 0, cy: 0 },
  totalPrice,
  totalProfitRate,
  onClick,
}: CustomLabelProps) => {
  const { cx, cy } = viewBox;
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold"
      >
        {totalPrice.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        dominantBaseline="central"
        className={`text-sm font-semibold ${
          totalProfitRate >= 0 ? 'fill-green-500' : 'fill-red-500'
        }`}
      >
        ({totalProfitRate.toFixed(2)}%{totalProfitRate >= 0 ? '▲' : '▼'})
      </text>
    </g>
  );
};

const Dashboard = () => {
  const {
    stockPrice,
    cryptoPrice,
    goldPrice,
    totalPrice,
    stocks,
    cryptocurrencies,
    gold,
    activeIndex,
    setActiveIndex,
    setShowAllItems,
    isLoading,
    error,
  } = usePortfolioStore();

  const categories = useMemo(
    () => [
      { name: '주식', value: stockPrice || 0 },
      { name: '암호화폐', value: cryptoPrice || 0 },
      { name: '금', value: goldPrice || 0 },
    ],
    [stockPrice, cryptoPrice, goldPrice]
  );

  const { totalProfitRate } = useMemo(() => {
    const allItems = [...stocks, ...cryptocurrencies, ...gold];
    let validItemsProfit = 0;
    let validItemsInitialValue = 0;

    allItems.forEach((item) => {
      const profitRate = Number(item.profitRate);
      if (isFinite(profitRate) && profitRate !== 0) {
        const profit = item.price * (profitRate / 100);
        const initialValue = item.price / (1 + profitRate / 100);
        validItemsProfit += profit;
        validItemsInitialValue += initialValue;
      }
    });

    const calculatedTotalProfitRate =
      validItemsInitialValue !== 0
        ? (validItemsProfit / validItemsInitialValue) * 100
        : 0;

    return {
      totalProfitRate: isFinite(calculatedTotalProfitRate)
        ? calculatedTotalProfitRate
        : 0,
    };
  }, [stocks, cryptocurrencies, gold]);

  const handleCenterClick = () => {
    setShowAllItems(true);
    setActiveIndex(undefined);
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <h2 className="text-3xl font-bold font-rix-reg mb-2">My Portfolio</h2>
      <p className="text-base text-gray-500 font-gmarket-sans mb-1">
        투자 항목을 보고싶으면 그래프를 눌러주세요.
      </p>
      <div className="flex justify-between items-center font-gmarket-sans">
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
                dataKey="value"
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
                      totalPrice={totalPrice}
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
                <span>
                  {((category.value / totalPrice) * 100 || 0).toFixed(2)}%{' '}
                </span>
                <span className="font-medium">
                  (
                  {category.value.toLocaleString('ko-KR', {
                    maximumFractionDigits: 2,
                  })}
                  원)
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
