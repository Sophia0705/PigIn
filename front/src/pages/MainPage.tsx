import { useState } from "react";
import { create } from "zustand";
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";
import { ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

import stockimg from "../assets/stock.svg";
import cryptoimg from "../assets/cryptocurrency.svg";
import goldimg from "../assets/gold.svg";
import currencyimg from "../assets/currency.svg";

interface FinanceState {
  balance: number;
  stocks: number;
  cash: number;
  savings: number;
}

const useFinanceStore = create<FinanceState>((_set) => ({
  balance: 15100,
  stocks: 9060,
  cash: 3020,
  savings: 3020,
}));

const QuizCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-teal-400 text-white rounded-xl mb-4 overflow-hidden">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold">오늘의 Quiz</h2>
        {isOpen ? (
          <ChevronUp className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6" />
        )}
      </div>
      {isOpen && (
        <div className="bg-white text-black p-4">
          <h3 className="font-semibold mb-2">금융 상식 퀴즈</h3>
          <h3>주가 Up Down?!</h3>
        </div>
      )}
    </div>
  );
};

interface CustomLabelProps {
  viewBox: any;
  value: number;
  percentageChange: number;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox,
  value,
  percentageChange,
}) => {
  const { cx, cy } = viewBox;
  const formattedValue = value.toLocaleString();
  const formattedPercentage = percentageChange.toFixed(2);

  return (
    <g>
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold fill-black"
      >
        {formattedValue}원
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-semibold fill-green-500"
      >
        +100원
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-semibold fill-green-500"
      >
        ({formattedPercentage}%▲)
      </text>
    </g>
  );
};

interface InvestmentCardProps {
  subject: string;
  value: number;
  percentageChange: number;
  data: Array<{ name: string; value: number; color: string }>;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  subject,
  value,
  percentageChange,
  data,
}) => {
  const totalBalance = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-blue-600 text-white pt-2 rounded-xl mb-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold">{subject}</h2>
        <ChevronRight className="w-6 h-6" />
      </div>
      <div className="bg-white text-black p-4 rounded-xl mb-4">
        <p className="text-xl text-right font-bold mb-4">
          계좌 잔액: {totalBalance.toLocaleString()}원
        </p>
        <hr />
        <div className="pt-2 flex justify-between items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={200}>
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
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                  <Label
                    content={
                      <CustomLabel
                        viewBox={{ cx: 0, cy: 0 }}
                        value={value}
                        percentageChange={percentageChange}
                      />
                    }
                    position="center"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-8">
            {data.map((category, _index) => (
              <div key={category.name} className="mb-2">
                <div className="flex items-center mb-1">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {category.name}
                  </span>
                </div>
                <div className="pl-5 text-sm">
                  <span>
                    {((category.value / totalBalance) * 100).toFixed(1)}%{" "}
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
    </div>
  );
};

interface CategoryButtonProps {
  icon: string;
  label: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center bg-white rounded-full p-6 w-32 h-32">
    <img src={icon} alt={label} className="w-15 h-15 mb-2" />
    <span className="text-base text-black">{label}</span>
  </button>
);

const MainPage: React.FC = () => {
  const { balance, stocks, cash, savings } = useFinanceStore();

  const investmentData = [
    { name: "주식", value: stocks, color: "#3B82F6" },
    { name: "금", value: cash, color: "#FBBF24" },
    { name: "가상화폐", value: savings, color: "#D1D5DB" },
  ];

  return (
    <div className="min-h-screen p-4">
      <QuizCard />
      <InvestmentCard
        subject="내 투자"
        value={balance}
        percentageChange={0.66}
        data={investmentData}
      />
      <div className="flex flex-col items-center justify-center mb-10 w-full">
        <div className="flex justify-evenly w-full mb-8">
          <CategoryButton icon={stockimg} label="주식" />
          <CategoryButton icon={cryptoimg} label="가상계좌" />
        </div>
        <div className="flex justify-evenly w-full">
          <CategoryButton icon={goldimg} label="금" />
          <CategoryButton icon={currencyimg} label="환율" />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
