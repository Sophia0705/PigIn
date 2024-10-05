import { useMemo, useRef } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { AssetItem } from '../interfaces/PortfolioInterface';

const PortfolioDetails = () => {
  const {
    stocks,
    cryptocurrencies,
    gold,
    activeIndex,
    showAllItems,
    isLoading,
    error,
  } = usePortfolioStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const items: (AssetItem & { categoryName: string })[] = useMemo(() => {
    if (showAllItems) {
      return [
        ...stocks.map((item) => ({ ...item, categoryName: '주식' })),
        ...cryptocurrencies.map((item) => ({
          ...item,
          categoryName: '가상화폐',
        })),
        ...gold.map((item) => ({ ...item, categoryName: '금' })),
      ];
    } else {
      switch (activeIndex) {
        case 0:
          return stocks.map((item) => ({ ...item, categoryName: '주식' }));
        case 1:
          return cryptocurrencies.map((item) => ({
            ...item,
            categoryName: '가상화폐',
          }));
        case 2:
          return gold.map((item) => ({ ...item, categoryName: '금' }));
        default:
          return [];
      }
    }
  }, [stocks, cryptocurrencies, gold, activeIndex, showAllItems]);

  if (isLoading) return <div className="text-center py-4">로딩중...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading details: {error}
      </div>
    );

  if (items.length === 0)
    return (
      <div className="text-center text-xl py-10">투자한 내역이 없습니다.</div>
    );

  const itemCount = items.length;
  const isItemLoaded = (index: number) => index < items.length;
  const loadMoreItems = (_startIndex: number, _stopIndex: number) => {
    return Promise.resolve();
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const calculateTotalValue = (price: number, amount: number) => {
      return (Number(price) * Number(amount)).toLocaleString('ko-KR', {
        maximumFractionDigits: 2,
      });
    };

    const item = items[index];
    const profitRate =
      typeof item.profitRate === 'string'
        ? parseFloat(item.profitRate)
        : item.profitRate;

    return (
      <div style={style} className="flex items-center border-b px-4">
        <div className="w-1/5 py-2 text-sm font-medium">
          {item.categoryName}
        </div>
        <div className="w-1/5 py-2 text-base font-semibold">{item.name}</div>
        <div className="w-1/5 py-2 font-medium text-base text-center">
          {calculateTotalValue(item.price, item.amount)}원
        </div>
        <div className="w-1/5 py-2 font-medium text-base text-center">
          {item.amount.toFixed(4)}{' '}
          {item.categoryName === '주식'
            ? '주'
            : item.categoryName === '가상화폐'
              ? '개'
              : 'kg'}
        </div>
        <div
          className={`w-1/5 py-2 font-medium text-base text-center ${
            profitRate >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {profitRate.toFixed(2)}% {profitRate >= 0 ? '▲' : '▼'}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 relative h-full pt-6 pb-24">
      <div className="w-11/12 mx-auto h-4 bg-customDarkGreen absolute top-2 left-0 right-0"></div>

      <div className="absolute top-4 left-0 right-0 bottom-24 mx-auto w-10/12">
        <div
          ref={containerRef}
          className="bg-white overflow-hidden relative"
          style={{ height: 'calc(100% - 24px)' }}
        >
          <h2 className="text-xl font-bold pt-4 mb-1 px-4">
            {showAllItems ? '전체 포트폴리오' : items[0]?.categoryName}
          </h2>
          <div className="h-full pt-4 pb-10 overflow-y-auto">
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }: any) => (
                <List
                  height={
                    containerRef.current
                      ? containerRef.current.clientHeight - 80
                      : 0
                  }
                  itemCount={itemCount}
                  itemSize={50}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                  width="100%"
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 px-3"
            style={{ transform: 'translateY(50%)' }}
          >
            <div className="flex justify-between items-center h-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-7 h-7 bg-gray-100 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
