import { useMemo } from 'react';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A'];

const CustomLabel = ({ viewBox, totalPrice }: any) => {
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
        {totalPrice.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원
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
    setActiveIndex,
    setShowAllItems,
    isLoading,
    error,
  } = usePortfolioStore();

  const data = useMemo(
    () => [
      { name: '주식', value: stockPrice },
      { name: '가상화폐', value: cryptoPrice },
      { name: '금', value: goldPrice },
    ],
    [stockPrice, cryptoPrice, goldPrice]
  );

  const handlePieClick = (
    _event: React.MouseEvent<SVGElement>,
    index: number
  ) => {
    setActiveIndex(index);
  };

  const handleCenterClick = () => {
    setShowAllItems(true);
  };

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="bg-white h-full rounded-2xl p-4">
      <h2 className="text-3xl font-bold font-rix-reg mb-2">My Portfolio</h2>
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onClick={handlePieClick}
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  content={<CustomLabel totalPrice={totalPrice} />}
                  position="center"
                  onClick={handleCenterClick}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-8">
          {data.map((item, index) => (
            <div key={item.name} className="mb-2">
              <div className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-gray-700 text-base font-normal">
                  {item.name}
                </span>
              </div>
              <div className="pl-3 font-medium text-base">
                <span className="">
                  {((item.value / totalPrice) * 100).toFixed(1)}%{' '}
                </span>
                <span className="font-medium">
                  (
                  {item.value.toLocaleString('ko-KR', {
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
