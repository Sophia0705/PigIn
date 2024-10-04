import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Edit, ChevronLeft, XCircle } from 'lucide-react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';
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
  const [showAutoDashboard, setShowAutoDashboard] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 100; // AutoDashboard를 숨길 스크롤 위치
      setShowAutoDashboard(scrollPosition <= threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value === '' || /^\d+$/.test(value)) {
      setLocalInvestmentAmount(value);
      setError('');
    } else {
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

  // 전체 카테고리의 총 할당된 퍼센트 계산
  const totalAllocatedPercentage = useMemo(() => {
    return Object.values(localAllocations).reduce(
      (total, categoryAllocations) =>
        total +
        categoryAllocations.reduce(
          (categoryTotal, allocation) => categoryTotal + allocation.percentage,
          0
        ),
      0
    );
  }, [localAllocations]);

  // 설정완료 버튼 활성화 여부
  const isSubmitEnabled = totalAllocatedPercentage === 100;

  const handleSubmit = () => {
    if (totalAllocatedPercentage !== 100) {
      return;
    }

    try {
      const numericAmount = Number(localInvestmentAmount);

      // Store 업데이트를 동기적으로 처리
      setInvestmentAmount(numericAmount);
      setAllocations(localAllocations);

      // 로컬 상태도 업데이트
      setLocalInvestmentAmount(numericAmount.toString());

      // API를 통한 설정 저장 (필요한 경우)
      // saveAutoInvestmentSettings({
      //   investmentAmount: numericAmount,
      //   allocations: localAllocations,
      //   isEnabled: isAutoInvestmentEnabled,
      // });

      alert('설정이 성공적으로 저장되었습니다.');

      // AutoDashboard를 강제로 리렌더링하기 위해 상태 업데이트
      setShowAutoDashboard(false);
      setTimeout(() => setShowAutoDashboard(true), 0);
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

  // 무한 스크롤 관련 함수들
  const itemCount = memoizedAllocations.length;
  const loadMoreItems = (_startIndex: number, _stopIndex: number) => {
    // allocation API로 가져올거임
    return Promise.resolve();
  };

  const isItemLoaded = (index: number) => index < memoizedAllocations.length;

  const AllocationItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const allocation = memoizedAllocations[index];
      if (!allocation) {
        return null;
      }

      const handleSliderChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = Number(e.currentTarget.value);
        requestAnimationFrame(() => {
          handleAllocationChange(allocation.symbol, value);
        });
      };

      return (
        <div style={{ ...style, width: '100%' }}>
          <div className="p-2 rounded-lg bg-white mb-2">
            <div className="flex items-center justify-between">
              <div className="flex-grow mr-2">
                <span className="text-black text-sm font-medium mb-1 block">
                  {allocation.symbol}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.percentage}
                  onInput={handleSliderChange}
                  className="w-full accent-customAqua"
                />
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-black text-sm">
                    {allocation.percentage}%
                  </span>
                  <span className="text-black text-xs">
                    {allocation.value.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveAllocation(allocation.symbol)}
                  className="text-red-500 p-1"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [memoizedAllocations, handleAllocationChange, handleRemoveAllocation]
  );

  return (
    <div className="bg-customDarkGreen w-full text-white p-4 pb-40">
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
            className={`w-12 h-6 ${
              isAutoInvestmentEnabled ? 'bg-customAqua' : 'bg-gray-600'
            } rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out`}
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

          {showAutoDashboard && <AutoDashboard key={localInvestmentAmount} />}

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

            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  className="List"
                  height={500}
                  itemCount={itemCount}
                  itemSize={70}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  width="100%"
                >
                  {AllocationItem}
                </List>
              )}
            </InfiniteLoader>

            {/* Footer (총 할당 비율 및 설정완료 버튼) */}
            <div className="fixed bottom-20 left-0 right-0 bg-customDarkGreen p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold">총 비율:</span>
                  <span
                    className={`text-2xl font-bold ${totalAllocatedPercentage === 100 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {totalAllocatedPercentage}%
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!isSubmitEnabled}
                  className={`py-2 px-6 rounded-md text-lg font-bold ${
                    isSubmitEnabled
                      ? 'bg-customAqua text-customDarkGreen'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  설정완료
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoInvestment;
