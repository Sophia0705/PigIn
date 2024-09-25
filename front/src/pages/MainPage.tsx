import { useState } from 'react';
import { create } from 'zustand';
import { NavLink } from 'react-router-dom';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface FinanceState {
  balance: number;
  stocks: number;
  cash: number;
  savings: number;
}

// 대충 넣은 데이터 -> 나중에 지워!!
const useFinanceStore = create<FinanceState>((_set) => ({
  balance: 15100,
  stocks: 9060,
  cash: 3020,
  savings: 3020,
}));

// 퀴즈 nav할 곳 (오늘의 퀴즈 풀면 숨겨야 함 - 나중에 구현!)
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
          <NavLink to="/quiz">
            <h3 className="text-black font-semibold mb-2">금융 상식 퀴즈</h3>
          </NavLink>
          <h3>주가 Up Down?!</h3>
        </div>
      )}
    </div>
  );
};

interface viewBoxType {
  cx: number;
  cy: number;
}

interface CustomLabelProps {
  viewBox: viewBoxType;
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

// 내 투자 카드모양 컴포넌트
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
                    {((category.value / totalBalance) * 100).toFixed(1)}%{' '}
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

// 나중에 밑에 추천 카드에 띄울 거
// interface RecommendCardProps {
//   subject : string;
//   category : string;  // 투자 아이템의 카테고리
//   item : string;  // 투자 종목
// }

// const RecommendCard: React.FC<RecommendCardProps> = ({

// }) => {}

// 임시로 띄워놓는거
interface TopItemProps {
  name: string;
}

const TopItem: React.FC<TopItemProps> = ({ name }) => (
  <div className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
    <span className="text-black">{name}</span>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

interface Top5ListProps {
  title: string;
  items: string[];
}

const Top5List: React.FC<Top5ListProps> = ({ title, items }) => (
  <div className="bg-blue-500 rounded-xl p-4 w-64">
    <h2 className="text-white font-bold mb-2">{title}</h2>
    <div className="bg-white rounded-lg p-2">
      {items.map((item, index) => (
        <TopItem key={index} name={item} />
      ))}
    </div>
  </div>
);

const Top5Lists: React.FC = () => {
  const stockItems = [
    '삼성전자',
    'LG에너지솔루션',
    '현대차',
    '삼성바이오로직스',
    'SK하이닉스',
  ];
  const cryptoItems = [
    '비트코인',
    '이더리움',
    '크레딧코인',
    '스텍스',
    '도지코인',
  ];

  return (
    <div className="flex gap-4 p-4 bg-customDarkGreen">
      <Top5List title="주식 점 Top5" items={stockItems} />
      <Top5List title="가상화폐 점 Top5" items={cryptoItems} />
    </div>
  );
};

const MainPage: React.FC = () => {
  const { balance, stocks, cash, savings } = useFinanceStore();

  const investmentData = [
    { name: '주식', value: stocks, color: '#3B82F6' },
    { name: '금', value: cash, color: '#FBBF24' },
    { name: '가상화폐', value: savings, color: '#D1D5DB' },
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
      <Top5Lists />
    </div>
  );
};

export default MainPage;
