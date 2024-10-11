import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInvestmentAccountInfo } from '../api/member/accountAPI';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import { fetchQuizStatus } from '../api/quiz/quizStatus';
import { useMemberStore } from '../store/memberStore';
import QuizCard from '../components/QuizCard';
import InvestmentInfoCard from '../components/InvestmentInfoCard';
import Top5Lists from '../components/Top5Lists';

const MainPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, checkLoginStatus } = useMemberStore();
  const [portfolioData, setPortfolioData] = useState({
    stockPrice: 0,
    cryptoPrice: 0,
    goldPrice: 0,
    totalPrice: 0,
  });
  const [totalAsset, setTotalAsset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState({
    oxQuizSolved: false,
    stockQuizSolved: false,
  });

  const handleAuthSuccess = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const [accountInfo, portfolioInfo, quizStatusInfo] = await Promise.all([
          fetchInvestmentAccountInfo(),
          fetchPortfolioData(),
          fetchQuizStatus(),
        ]);
        setTotalAsset(accountInfo.balance);
        setPortfolioData(portfolioInfo);
        setQuizStatus(quizStatusInfo);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const categories = useMemo(() => {
    if (!isLoggedIn) {
      return [
        { name: '주식', value: 33.3333 },
        { name: '암호화폐', value: 33.3333 },
        { name: '금', value: 33.3333 },
      ];
    }
    const { stockPrice, cryptoPrice, goldPrice } = portfolioData;
    const data = [
      { name: '주식', value: stockPrice },
      { name: '암호화폐', value: cryptoPrice },
      { name: '금', value: goldPrice },
    ];
    return data.filter((item) => item.value > 0);
  }, [isLoggedIn, portfolioData]);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide">
      <div className="min-h-full p-6 font-gmarket-sans">
        <QuizCard
          isLoggedIn={isLoggedIn}
          fetchQuizStatus={() => Promise.resolve(quizStatus)}
        />
        <InvestmentInfoCard
          subject="내 투자"
          categories={categories}
          totalAsset={isLoggedIn ? totalAsset : 0}
          portfolioTotal={isLoggedIn ? portfolioData.totalPrice : 100}
          onAuthSuccess={handleAuthSuccess}
          isLoggedIn={isLoggedIn}
        />
        <Top5Lists />
      </div>
    </div>
  );
};

export default MainPage;
