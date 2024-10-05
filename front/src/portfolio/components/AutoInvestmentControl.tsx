import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { XCircle } from 'lucide-react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';

const CATEGORIES = ['주식', '가상화폐', '금'];

interface AutoInvestmentControlProps {
  localAllocations: { [key: string]: { symbol: string; percentage: number }[] };
  setLocalAllocations: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { symbol: string; percentage: number }[];
    }>
  >;
  localInvestmentAmount: string;
  handleSubmit: () => void;
}

const AutoInvestmentControl: React.FC<AutoInvestmentControlProps> = ({
  localAllocations,
  setLocalAllocations,
  localInvestmentAmount,
  handleSubmit,
}) => {
  const { activeCategory, setActiveCategory } = useAutoInvestmentStore();
  const [listHeight, setListHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setListHeight(window.innerHeight - 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAllocationChange = useCallback(
    (symbol: string, value: number) => {
      setLocalAllocations((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].map((allocation) =>
          allocation.symbol === symbol
            ? { ...allocation, percentage: value }
            : allocation
        ),
      }));
    },
    [activeCategory, setLocalAllocations]
  );

  const handleRemoveAllocation = useCallback(
    (symbol: string) => {
      setLocalAllocations((prev) => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(
          (allocation) => allocation.symbol !== symbol
        ),
      }));
    },
    [activeCategory, setLocalAllocations]
  );

  const memoizedAllocations = useMemo(() => {
    const numericAmount = Number(localInvestmentAmount) || 0;
    return localAllocations[activeCategory].map((allocation) => ({
      ...allocation,
      value: (allocation.percentage / 100) * numericAmount,
    }));
  }, [localAllocations, activeCategory, localInvestmentAmount]);

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

  const isSubmitEnabled = totalAllocatedPercentage === 100;

  const itemCount = memoizedAllocations.length + 1;
  const loadMoreItems = (_startIndex: number, _stopIndex: number) =>
    Promise.resolve();
  const isItemLoaded = (index: number) => index < itemCount;

  const AllocationItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (index === memoizedAllocations.length) {
        return (
          <div style={style}>
            <div className="bg-customDarkGreen p-2 w-[90%] mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-white">총 비율:</span>
                  <span
                    className={`text-2xl font-bold ${
                      totalAllocatedPercentage === 100
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
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
        );
      }

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
        <div style={style}>
          <div className="p-2 w-[90%] mx-auto rounded-lg bg-white mb-2">
            <div className="flex items-center justify-between">
              <div className="flex-grow ml-2 mr-1">
                <span className="text-black text-lg mb-1 block">
                  {allocation.symbol}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={allocation.percentage}
                  onInput={handleSliderChange}
                  className="w-5/6 accent-customAqua"
                />
              </div>
              <div className="flex w-1/5 mr-3 items-center">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-black text-medium">
                    {allocation.percentage}%
                  </span>
                  <span className="text-black text-base">
                    {allocation.value.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveAllocation(allocation.symbol)}
                  className="text-red-500 p-2"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [
      memoizedAllocations,
      handleAllocationChange,
      handleRemoveAllocation,
      totalAllocatedPercentage,
      isSubmitEnabled,
      handleSubmit,
    ]
  );

  return (
    <div className="mt-3 h-full" ref={containerRef}>
      <div className="bg-[#EAFFF7] w-[95%] mx-auto p-1 rounded-full flex justify-between items-center mb-3">
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

      {listHeight > 0 && (
        <div className="flex-grow overflow-hidden">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                className="List"
                height={listHeight - 35}
                itemCount={itemCount}
                itemSize={80}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width="100%"
              >
                {AllocationItem}
              </List>
            )}
          </InfiniteLoader>
        </div>
      )}
    </div>
  );
};

export default AutoInvestmentControl;
