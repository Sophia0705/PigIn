import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, ChevronLeft, XCircle } from 'lucide-react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';
// import { saveAutoInvestment } from '../../api/portfolio/autoInvestment';
import AutoDashboard from '../components/AutoDashboard';

const CATEGORIES = ['주식', '가상화폐', '금'];

const AutoInvestment: React.FC = () => {
  const nav = useNavigate();
  const {
    investmentAmount,
    setInvestmentAmount,
    allocations,
    setAllocations,
    activeCategory,
    setActiveCategory,
    isAutoInvestmentEnabled,
    setIsAutoInvestmentEnabled,
  } = useAutoInvestmentStore();

  const [localAllocations, setLocalAllocations] = useState(allocations);
  const [showInput, setShowInput] = useState(false);
  const [localInvestmentAmount, setLocalInvestmentAmount] = useState(
    investmentAmount.toString()
  );
  const [error, setError] = useState<string>('');

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // 입력값이 비어있거나 숫자로만 구성되어 있는지 확인
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInvestmentAmount(value);
      setError('');
    } else {
      // 숫자가 아닌 값이 입력된 경우 에러 메시지 설정
      setError('숫자만 입력해주세요.');
    }
  };

  const handleAllocationChange = (symbol: string, value: number) => {
    setLocalAllocations((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((allocation) =>
        allocation.symbol === symbol
          ? { ...allocation, percentage: value }
          : allocation
      ),
    }));
  };

  const handleRemoveAllocation = (symbol: string) => {
    setLocalAllocations((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].filter(
        (allocation) => allocation.symbol !== symbol
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      // 로컬 상태를 전역 상태로 업데이트
      const numericAmount = Number(localInvestmentAmount);
      setInvestmentAmount(numericAmount);
      setAllocations(localAllocations);

      // API를 통한 설정 저장
      // await saveAutoInvestmentSettings({
      //   investmentAmount: numericAmount,
      //   allocations: localAllocations,
      //   isEnabled: isAutoInvestmentEnabled,
      // });

      // 성공 메시지 표시
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('자동 투자 설정 저장 중 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const memoizedAllocations = useMemo(() => {
    const numericAmount = Number(localInvestmentAmount) || 0;
    return localAllocations[activeCategory].map((allocation) => ({
      ...allocation,
      value: (allocation.percentage / 100) * numericAmount,
    }));
  }, [localAllocations, activeCategory, localInvestmentAmount]);

  return (
    <div className="bg-customDarkGreen w-full text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => nav(-1)}
          className="text-xl text-white bg-customDarkGreen p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="flex items-center">
          <span className="mr-2 text-lg">자동화 투자</span>
          <div
            className={`w-12 h-6 ${isAutoInvestmentEnabled ? 'bg-customAqua' : 'bg-gray-600'} rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out`}
            onClick={() => setIsAutoInvestmentEnabled(!isAutoInvestmentEnabled)}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                isAutoInvestmentEnabled ? 'translate-x-6' : ''
              }`}
            ></div>
          </div>
        </div>
      </div>

      {!isAutoInvestmentEnabled && (
        <div className="mb-4 text-center">
          <p>자동화 투자를 활성화하려면 스위치를 켜세요.</p>
        </div>
      )}

      {isAutoInvestmentEnabled && (
        <>
          {showInput ? (
            <div className="flex flex-col mb-6 bg-white rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-grow mr-4">
                  <p className="p-2 text-black text-lg">
                    투자가능금액 : xxxx원
                  </p>
                  <input
                    type="text"
                    value={localInvestmentAmount}
                    onChange={handleInvestmentAmountChange}
                    className={`w-full bg-transparent border-b ${
                      error ? 'border-red-500' : 'border-customAqua'
                    } p-2 text-xl text-black placeholder-gray-500 placeholder:text-base focus:outline-none`}
                    placeholder="자동 투자하실 금액을 입력해주세요"
                  />
                </div>
                <button
                  onClick={() => setShowInput(false)}
                  className="bg-customAqua text-customDarkGreen p-3 rounded text-lg whitespace-nowrap self-start"
                >
                  투자
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>
              )}
            </div>
          ) : (
            <div className="mb-6 text-center">
              <p className="text-lg mb-2">자동 투자금액 설정금액</p>
              <div className="flex items-center justify-center">
                <p className="text-3xl font-bold mr-2">
                  {Number(localInvestmentAmount).toLocaleString()}원
                </p>
                <Edit onClick={() => setShowInput(true)} />
              </div>
            </div>
          )}

          <AutoDashboard />

          <div className="mt-6">
            <div className="bg-[#EAFFF7] p-1 rounded-full flex justify-between items-center mb-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                  flex-1 py-2 px-4 text-lg font-medium rounded-full
                  ${
                    activeCategory === category
                      ? 'bg-customDarkGreen text-white'
                      : 'bg-transparent text-customDarkGreen'
                  }
                  transition-colors duration-200
                `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 나중에 여기 내부 스크롤되게 만들어야 함 */}
            {memoizedAllocations.map((allocation) => (
              <div
                key={allocation.symbol}
                className="p-4 rounded-lg bg-white mb-4"
              >
                <div className="flex items-center">
                  <div className="w-3/4 mr-4">
                    <span className="text-black text-lg mb-2 block">
                      {allocation.symbol}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={allocation.percentage}
                      onChange={(e) =>
                        handleAllocationChange(
                          allocation.symbol,
                          Number(e.target.value)
                        )
                      }
                      className="w-full accent-customAqua"
                    />
                  </div>
                  <div className="flex items-center w-1/4">
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-black text-base">
                        {allocation.percentage}%
                      </span>
                      <span className="text-black text-base">
                        {allocation.value.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAllocation(allocation.symbol)}
                      className="text-red-500 justify-end p-4 self-center"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="mt-6 bg-customAqua text-customDarkGreen py-2 px-4 rounded justify-end w-1/3 font-bold"
            >
              설정완료
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoInvestment;
