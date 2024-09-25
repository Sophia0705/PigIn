// 1. 자동투자금 or 금액 설정 input
// 2. Dashboard 재사용
import Dashboard from '../components/Dashboard';
// 3. 메뉴바(주식, 가상화페, 금) 설정하게
// 4. 메뉴바 누른 것에 따라서 밑에 나올 결과값 & %나 금액 설정, 삭제할 곳

import { useState, useMemo } from 'react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';
import { useNavigate } from 'react-router-dom';

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
  const [localInvestmentAmount, setLocalInvestmentAmount] =
    useState(investmentAmount);

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalInvestmentAmount(Number(e.target.value));
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
      setInvestmentAmount(localInvestmentAmount);
      setAllocations(localAllocations);

      // 임시로 콘솔에 로그 출력
      console.log('설정이 저장되었습니다:', {
        investmentAmount: localInvestmentAmount,
        allocations: localAllocations,
        isEnabled: isAutoInvestmentEnabled,
      });

      // 임시 성공 메시지 표시
      alert('설정이 성공적으로 저장되었습니다.');

      //       // API 호출을 통한 DB 저장
      //       const response = await fetch('api주소', {
      //         method: 'POST',
      //         headers: {
      //             // 아마도...?
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           investmentAmount: localInvestmentAmount,
      //           allocations: localAllocations,
      //           isEnabled: isAutoInvestmentEnabled,
      //         }),
      //       });

      //       if (!response.ok) {
      //         throw new Error('자동 투자 설정 저장에 실패했습니다');
      //       }

      //       // 성공 메시지 표시
      //       alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('자동 투자 설정 저장 중 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const memoizedAllocations = useMemo(() => {
    return localAllocations[activeCategory].map((allocation) => ({
      ...allocation,
      value: (allocation.percentage / 100) * localInvestmentAmount,
    }));
  }, [localAllocations, activeCategory, localInvestmentAmount]);

  return (
    <div className="bg-customDarkGreen text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => nav(-1)} className="text-xl">
          &lt;
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
            <div className="mb-6">
              <input
                type="text"
                value={localInvestmentAmount}
                onChange={handleInvestmentAmountChange}
                className="w-full bg-transparent border-b border-customAqua py-2 text-white placeholder-gray-400 focus:outline-none"
                placeholder="자동 투자하실 금액을 입력해주세요"
              />
              <button
                onClick={() => setShowInput(false)}
                className="mt-2 bg-customAqua text-customDarkGreen py-2 px-4 rounded"
              >
                확인
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-lg">자동 투자금액 설정금액</p>
              <p className="text-3xl font-bold">
                {localInvestmentAmount.toLocaleString()}원
              </p>
              <button
                onClick={() => setShowInput(true)}
                className="text-customAqua"
              >
                수정
              </button>
            </div>
          )}

          <Dashboard />

          <div className="mt-6">
            <div className="flex justify-between mb-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`py-2 px-4 rounded ${
                    activeCategory === category
                      ? 'bg-customAqua text-customDarkGreen'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {memoizedAllocations.map((allocation) => (
              <div
                key={allocation.symbol}
                className="flex items-center justify-between mb-4"
              >
                <span>{allocation.symbol}</span>
                <div className="flex items-center">
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
                    className="mr-2 accent-customAqua"
                  />
                  <span>
                    {allocation.percentage}% (
                    {allocation.value.toLocaleString()}원)
                  </span>
                  <button
                    onClick={() => handleRemoveAllocation(allocation.symbol)}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-customAqua text-customDarkGreen py-2 px-4 rounded w-full font-bold"
          >
            설정완료
          </button>
        </>
      )}
    </div>
  );
};

export default AutoInvestment;
