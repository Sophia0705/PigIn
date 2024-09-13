import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Sector,
} from 'recharts';

interface PortfolioData {
  name: string;
  value: number;
}

interface DashboardProps {
  data: PortfolioData[];
  colors: string[];
  activeIndex: number | undefined;
  setActiveIndex: (index: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  colors,
  activeIndex,
  setActiveIndex,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        투자 항목을 보고싶으면 그래프를 눌러주세요.
      </p>
      <div className="flex justify-center mb-4">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onClick={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
              <Label
                content={({ viewBox: { cx, cy } }) => (
                  <g>
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xl font-bold"
                    >
                      {total.toLocaleString()}원
                    </text>
                    <text
                      x={cx}
                      y={cy + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-sm text-green-500"
                    >
                      +100원 (0.66%↑)
                    </text>
                  </g>
                )}
                position="center"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex justify-between items-center mt-2"
          >
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span>{item.name}</span>
            </div>
            <span>
              {((item.value / total) * 100).toFixed(0)}% (
              {item.value.toLocaleString()}원)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
