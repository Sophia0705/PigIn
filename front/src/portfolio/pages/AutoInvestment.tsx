import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';
import AutoDashboard from '../components/AutoDashboard';
import InvestmentAmountInput from '../components/InvestAmountInput';
import AutoInvestmentControl from '../components/AutoInvestmentControl';
import {
  fetchAutoInvestment,
  saveAutoInvestment,
} from '../../api/portfolio/autoInvestment';

const AutoInvestment: React.FC = () => {
  const nav = useNavigate();
  const {
    isEnabled,
    setIsEnabled,
    investmentAmount,
    setInvestmentAmount,
    stocks,
    setStocks,
    coins,
    setCoins,
    golds,
    setGolds,
  } = useAutoInvestmentStore();

  const [localInvestmentAmount, setLocalInvestmentAmount] = useState(
    investmentAmount.toString()
  );
  const [autoDashboardKey, setAutoDashboardKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAutoInvestment();
        setIsEnabled(data.isEnabled);
        setInvestmentAmount(data.investmentAmount);
        setStocks(data.stocks);
        setCoins(data.coins);
        setGolds(data.golds);
        setLocalInvestmentAmount(data.investmentAmount.toString());
      } catch (error) {
        console.error('자동 투자 정보 가져오기 실패:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const numericAmount = Number(localInvestmentAmount);
      const result = await saveAutoInvestment({
        isEnabled,
        investmentAmount: numericAmount,
        stocks,
        coins,
        golds,
      });
      if (result.result) {
        setInvestmentAmount(numericAmount);
        alert('설정이 성공적으로 저장되었습니다.');
        setAutoDashboardKey((prev) => prev + 1);
      } else {
        alert('설정 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('자동 투자 설정 저장 중 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleToggleEnabled = async () => {
    try {
      const newIsEnabled = !isEnabled;
      const result = await saveAutoInvestment({
        isEnabled: newIsEnabled,
        investmentAmount: Number(localInvestmentAmount),
        stocks,
        coins,
        golds,
      });
      if (result.result) {
        setIsEnabled(newIsEnabled);
        alert(
          `자동화 투자가 ${newIsEnabled ? '활성화' : '비활성화'}되었습니다.`
        );
      } else {
        alert('설정 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('자동 투자 설정 변경 중 오류:', error);
      alert('설정 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="bg-customDarkGreen h-screen flex flex-col overflow-hidden font-gmarket-sans">
      <div className="flex justify-between items-center p-3">
        <button
          onClick={() => nav(-1)}
          className="text-xl text-white bg-customDarkGreen p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="flex items-center">
          <span className="mr-2 text-lg text-white">자동화 투자</span>
          <div
            className={`w-12 h-6 ${
              isEnabled ? 'bg-customAqua' : 'bg-gray-600'
            } rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out`}
            onClick={handleToggleEnabled}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isEnabled ? 'translate-x-6' : ''
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        {!isEnabled && (
          <div className="h-full flex items-center justify-center">
            <p className="text-white text-center">
              자동화 투자를 활성화하려면 스위치를 켜세요.
            </p>
          </div>
        )}

        {isEnabled && (
          <div className="h-full flex flex-col">
            <div className="p-2">
              <InvestmentAmountInput
                localInvestmentAmount={localInvestmentAmount}
                setLocalInvestmentAmount={setLocalInvestmentAmount}
              />
              <AutoDashboard key={autoDashboardKey} />
            </div>
            <div className="flex-grow overflow-hidden">
              <AutoInvestmentControl
                localInvestmentAmount={localInvestmentAmount}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoInvestment;
