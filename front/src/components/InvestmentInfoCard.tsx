import { NavLink } from 'react-router-dom';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';
import AuthGuardClickable from '../member/components/AuthGuardClickable';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A'];

interface CustomLabelProps {
  viewBox?: { cx: number; cy: number };
  totalPrice: number;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  viewBox = { cx: 0, cy: 0 },
  totalPrice,
}) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold fill-black"
      >
        {totalPrice.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
      </text>
    </g>
  );
};

interface InvestmentInfoCardProps {
  subject: string;
  categories: Array<{ name: string; value: number }>;
  totalAsset: number;
  portfolioTotal: number;
  onAuthSuccess: (path: string) => void;
  isLoggedIn: boolean;
}

const InvestmentInfoCard: React.FC<InvestmentInfoCardProps> = ({
  subject,
  categories,
  totalAsset,
  portfolioTotal,
  onAuthSuccess,
  isLoggedIn,
}) => {
  return (
    <div className="bg-blue-600 text-white pt-2 rounded-xl mb-4">
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-xl m-1 font-semibold">{subject}</h2>
        <AuthGuardClickable onAuthSuccess={() => onAuthSuccess('/myportfolio')}>
          <NavLink to="/myportfolio">
            {' '}
            <ChevronRight className="w-6 h-6" />
          </NavLink>
        </AuthGuardClickable>
      </div>
      <div className="bg-white text-black p-4 rounded-xl mb-4">
        {isLoggedIn ? (
          <>
            <p className="text-xl text-right font-bold mb-4">
              투자 자산: {totalAsset.toLocaleString()}원
            </p>
            <hr />
          </>
        ) : (
          <p className="text-xl text-center font-bold mb-4">
            PigIn과 함께 투자를 시작해보세요!
          </p>
        )}
        <div className="pt-2 flex justify-between items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={170}>
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
                >
                  {categories.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  {isLoggedIn && (
                    <Label
                      content={<CustomLabel totalPrice={portfolioTotal} />}
                      position="center"
                    />
                  )}
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
                  <span className="text-gray-700 text-sm font-medium">
                    {category.name}
                  </span>
                </div>
                <div className="pl-5 text-sm">
                  <span>
                    {((category.value / portfolioTotal) * 100).toFixed(1)}%{' '}
                  </span>
                  {isLoggedIn && (
                    <span className="ml-2">
                      ({category.value.toLocaleString()}원)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentInfoCard;
