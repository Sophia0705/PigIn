import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInvestmentAccountInfo } from '../api/member/accountAPI';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import QuizCard from '../components/QuizCard';
import InvestmentInfoCard from '../components/InvestmentInfoCard';
import Top5Lists from '../components/Top5Lists';

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

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-6 font-gmarket-sans">
      <QuizCard />
      {totalAsset > 0 ? (
        <InvestmentInfoCard
          subject="내 투자"
          categories={categories}
          totalAsset={totalAsset}
          portfolioTotal={portfolioData.totalPrice}
          onAuthSuccess={handleAuthSuccess}
        />
      ) : (
        <div>투자를 시작해보세요!</div>
      )}
      <Top5Lists />
    </div>
  );
};

export default MainPage;
