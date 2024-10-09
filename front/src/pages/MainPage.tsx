import { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { fetchInvestmentAccountInfo } from '../api/member/accountAPI';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import axiosInstance from '../api/axiosInstance';
import AuthGuardClickable from '../member/components/AuthGuardClickable';

export const fetchTopStocks = async () => {
  try {
    const response = await axiosInstance.get('api/stock/rank');
    console.log('주식Top5GET res', response.data);
    return response.data;
  } catch (error) {
    console.log('주식Top5GET 실패핑', error);
    throw error;
  }
};

export const fetchTopCryptos = async () => {
  try {
    const response = await axiosInstance.get('api/coin/rank');
    console.log('가상화폐Top5 GET res', response.data);
    return response.data;
  } catch (error) {
    console.log('가상화폐Top5 GET 실패핑', error);
    throw error;
  }
};

// QuizCard 컴포넌트
const QuizCard = () => {
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
          <NavLink to="/flow-quiz">
            <h3>주가 Up Down?!</h3>
          </NavLink>
        </div>
      )}
    </div>
  );
};

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

interface InvestmentCardProps {
  subject: string;
  categories: Array<{ name: string; value: number }>;
  totalAsset: number;
  portfolioTotal: number;
  onAuthSuccess: (path: string) => void;
}
const InvestmentCard: React.FC<InvestmentCardProps> = ({
  subject,
  categories,
  totalAsset,
  portfolioTotal,
  onAuthSuccess,
}) => {
  return (
    <div className="bg-blue-600 text-white pt-2 rounded-xl mb-4">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold">{subject}</h2>
        <AuthGuardClickable onAuthSuccess={() => onAuthSuccess('/myportfolio')}>
          <NavLink to="/myportfolio">
            {' '}
            <ChevronRight className="w-6 h-6" />
          </NavLink>
        </AuthGuardClickable>
      </div>
      <div className="bg-white text-black p-4 rounded-xl mb-4">
        <p className="text-xl text-right font-bold mb-4">
          총 자산: {totalAsset.toLocaleString()}원
        </p>
        <hr />
        <div className="pt-2 flex justify-between items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={200}>
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
                  <Label
                    content={<CustomLabel totalPrice={portfolioTotal} />}
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
                  <span className="text-gray-700 text-sm font-medium">
                    {category.name}
                  </span>
                </div>
                <div className="pl-5 text-sm">
                  <span>
                    {((category.value / portfolioTotal) * 100).toFixed(1)}%{' '}
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

// Top5Lists 컴포넌트
interface TopItemProps {
  id: string;
  name: string;
}

const TopItem: React.FC<TopItemProps> = ({ id: _id, name }) => (
  <div className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
    <span className="text-black">{name}</span>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

interface Top5ListProps {
  title: string;
  items: TopItemProps[];
  isLoading: boolean;
  error: string | null;
}

const Top5List: React.FC<Top5ListProps> = ({
  title,
  items,
  isLoading,
  error,
}) => (
  <div className="bg-blue-500 rounded-xl p-4 w-64">
    <h2 className="text-white font-bold mb-2">{title}</h2>
    <div className="bg-white rounded-lg p-2">
      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">에러: {error}</p>}
      {!isLoading &&
        !error &&
        items.map((item) => (
          <TopItem key={item.id} id={item.id} name={item.name} />
        ))}
    </div>
  </div>
);

const Top5Lists: React.FC = () => {
  const [topStocks, setTopStocks] = useState<TopItemProps[]>([]);
  const [topCryptos, setTopCryptos] = useState<TopItemProps[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [isLoadingCryptos, setIsLoadingCryptos] = useState(true);
  const [errorStocks, setErrorStocks] = useState<string | null>(null);
  const [errorCryptos, setErrorCryptos] = useState<string | null>(null);

  useEffect(() => {
    const loadTopStocks = async () => {
      try {
        const data = await fetchTopStocks();
        setTopStocks(
          data.map((stock: any) => ({
            id: stock.stockItemId,
            name: stock.stockItemName,
          }))
        );
        setIsLoadingStocks(false);
      } catch (error) {
        console.error('Failed to fetch top stocks:', error);
        setErrorStocks('주식 데이터를 불러오는데 실패했습니다.');
        setIsLoadingStocks(false);
      }
    };

    const loadTopCryptos = async () => {
      try {
        const data = await fetchTopCryptos();
        setTopCryptos(
          data.map((crypto: any) => ({
            id: crypto.coinItemId,
            name: crypto.coinItemName,
          }))
        );
        setIsLoadingCryptos(false);
      } catch (error) {
        console.error('Failed to fetch top cryptos:', error);
        setErrorCryptos('가상화폐 데이터를 불러오는데 실패했습니다.');
        setIsLoadingCryptos(false);
      }
    };

    loadTopStocks();
    loadTopCryptos();
  }, []);

  return (
    <div className="flex gap-4 p-4 bg-customDarkGreen">
      <Top5List
        title="주식 찜 Top5"
        items={topStocks}
        isLoading={isLoadingStocks}
        error={errorStocks}
      />
      <Top5List
        title="가상화폐 찜 Top5"
        items={topCryptos}
        isLoading={isLoadingCryptos}
        error={errorCryptos}
      />
    </div>
  );
};

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState({
    stockPrice: 0,
    cryptoPrice: 0,
    goldPrice: 0,
    totalPrice: 0,
  });
  const [totalAsset, setTotalAsset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountInfo, portfolioInfo] = await Promise.all([
          fetchInvestmentAccountInfo(),
          fetchPortfolioData(),
        ]);
        setTotalAsset(accountInfo.balance);
        setPortfolioData(portfolioInfo);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = useMemo(() => {
    const { stockPrice, cryptoPrice, goldPrice } = portfolioData;
    const data = [
      { name: '주식', value: stockPrice },
      { name: '암호화폐', value: cryptoPrice },
      { name: '금', value: goldPrice },
    ];
    return data.filter((item) => item.value > 0);
  }, [portfolioData]);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-4">
      <QuizCard />
      {totalAsset > 0 ? (
        <InvestmentCard
          subject="내 투자"
          categories={categories}
          totalAsset={totalAsset}
          portfolioTotal={portfolioData.totalPrice}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        <div>투자 정보가 없습니다.</div>
      )}
      <Top5Lists />
    </div>
  );
};

export default MainPage;
