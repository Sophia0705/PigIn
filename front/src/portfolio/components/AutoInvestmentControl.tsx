import React, { useCallback, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { XCircle } from 'lucide-react';
import { useAutoInvestmentStore } from '../../store/autoInvestmentStore';

const CATEGORIES = ['stocks', 'coins', 'golds'] as const;

interface AutoInvestmentControlProps {
  localInvestmentAmount: string;
  handleSubmit: () => void;
}

const AutoInvestmentControl: React.FC<AutoInvestmentControlProps> = ({
  localInvestmentAmount,
  handleSubmit,
}) => {
  const {
    activeCategory,
    setActiveCategory,
    stocks,
    setStocks,
    coins,
    setCoins,
    golds,
    setGolds,
  } = useAutoInvestmentStore();

  const [listHeight, setListHeight] = useState(window.innerHeight - 200);

  useEffect(() => {
    const handleResize = () => setListHeight(window.innerHeight - 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getActiveData = useCallback(() => {
    switch (activeCategory) {
      case 'stocks':
        return stocks;
      case 'coins':
        return coins;
      case 'golds':
        return golds;
      default:
        return [];
    }
  }, [activeCategory, stocks, coins, golds]);

  const handleAllocationChange = useCallback(
    (id: string, value: number) => {
      const updateFunction = (items: any[]) =>
        items.map((item) => {
          if ('stockCode' in item && item.stockCode === id)
            return { ...item, percent: value };
          if ('coinCode' in item && item.coinCode === id)
            return { ...item, percent: value };
          if ('gold' in item && item.gold === id)
            return { ...item, percent: value };
          return item;
        });

      switch (activeCategory) {
        case 'stocks':
          setStocks(updateFunction(stocks));
          break;
        case 'coins':
          setCoins(updateFunction(coins));
          break;
        case 'golds':
          setGolds(updateFunction(golds));
          break;
      }
    },
    [activeCategory, setStocks, setCoins, setGolds, stocks, coins, golds]
  );

  const handleRemoveAllocation = useCallback(
    (id: string) => {
      const removeFunction = (items: any[]) =>
        items.filter(
          (item) =>
            !('stockCode' in item && item.stockCode === id) &&
            !('coinCode' in item && item.coinCode === id) &&
            !('gold' in item && item.gold === id)
        );

      switch (activeCategory) {
        case 'stocks':
          setStocks(removeFunction(stocks));
          break;
        case 'coins':
          setCoins(removeFunction(coins));
          break;
        case 'golds':
          setGolds(removeFunction(golds));
          break;
      }
    },
    [activeCategory, setStocks, setCoins, setGolds, stocks, coins, golds]
  );

  const memoizedAllocations = getActiveData();

  const totalAllocatedPercentage = [...stocks, ...coins, ...golds].reduce(
    (total, item) => total + (item.percent || 0),
    0
  );

  const itemCount = memoizedAllocations.length + 1;
  const loadMoreItems = () => Promise.resolve();
  const isItemLoaded = (index: number) => index < itemCount;

  const AllocationItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    if (index === memoizedAllocations.length) {
      return (
        <div style={style}>
          <div className="bg-customDarkGreen p-2 w-[90%] mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-white">총 비율:</span>
                <span
                  className={`text-2xl font-bold ${totalAllocatedPercentage === 100 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {totalAllocatedPercentage}%
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={totalAllocatedPercentage !== 100}
                className={`py-2 px-6 rounded-md text-lg font-bold ${
                  totalAllocatedPercentage === 100
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
    if (!allocation) return null;

    const handleSliderChange = (e: React.FormEvent<HTMLInputElement>) => {
      const value = Number(e.currentTarget.value);
      const id =
        'stockCode' in allocation
          ? allocation.stockCode
          : 'coinCode' in allocation
            ? allocation.coinCode
            : 'gold' in allocation
              ? allocation.gold
              : '';
      requestAnimationFrame(() => handleAllocationChange(id, value));
    };

    const name =
      'stockName' in allocation
        ? allocation.stockName
        : 'coinName' in allocation
          ? allocation.coinName
          : 'goldName' in allocation
            ? allocation.goldName
            : '';
    const id =
      'stockCode' in allocation
        ? allocation.stockCode
        : 'coinCode' in allocation
          ? allocation.coinCode
          : 'gold' in allocation
            ? allocation.gold
            : '';

    return (
      <div style={style}>
        <div className="p-2 w-[90%] mx-auto rounded-lg bg-white mb-2">
          <div className="flex items-center justify-between">
            <div className="flex-grow ml-2 mr-1">
              <span className="text-black text-lg mb-1 block">{name}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={allocation.percent}
                onInput={handleSliderChange}
                className="w-5/6 accent-customAqua"
              />
            </div>
            <div className="flex w-1/5 mr-3 items-center">
              <div className="flex flex-col items-end mr-1">
                <span className="text-black text-medium">
                  {allocation.percent}%
                </span>
                <span className="text-black text-base">
                  {(
                    (allocation.percent / 100) *
                    Number(localInvestmentAmount)
                  ).toLocaleString()}
                  원
                </span>
              </div>
              <button
                onClick={() => handleRemoveAllocation(id)}
                className="text-red-500 p-2"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3 h-full">
      <div className="bg-[#EAFFF7] w-[95%] mx-auto p-1 rounded-full flex justify-between items-center mb-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              flex-1 py-2 px-4 text-lg font-medium rounded-full
              ${activeCategory === category ? 'bg-customDarkGreen text-white' : 'bg-transparent text-customDarkGreen'}
              transition-colors duration-200
            `}
          >
            {category === 'stocks'
              ? '주식'
              : category === 'coins'
                ? '가상화폐'
                : '금'}
          </button>
        ))}
      </div>

      <div className="flex-grow overflow-hidden">
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              className="List"
              height={listHeight}
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
    </div>
  );
};

export default AutoInvestmentControl;
