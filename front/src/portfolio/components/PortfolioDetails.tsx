import { useMemo, useRef } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface ItemData {
  name: string;
  price: number;
  amount?: number;
  quantity?: number;
  profitRate: number | string;
  stockCode?: string;
  coinCode?: string;
}

const PortfolioDetails = () => {
  const {
    stocks,
    cryptocurrencies,
    gold,
    activeIndex,
    isLoading,
    error,
    showAllItems,
  } = usePortfolioStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const items: ItemData[] = useMemo(() => {
    if (showAllItems) {
      return [
        ...stocks,
        ...cryptocurrencies,
        ...(Array.isArray(gold) ? gold : [gold]),
      ];
    }
    switch (activeIndex) {
      case 0:
        return stocks;
      case 1:
        return cryptocurrencies;
      case 2:
        return Array.isArray(gold) ? gold : [gold];
      default:
        return [];
    }
  }, [stocks, cryptocurrencies, gold, activeIndex, showAllItems]);

  if (isLoading) {
    return <div className="text-center py-4">Loading details...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error loading details: {error}
      </div>
    );
  }

  const itemCount = items.length;
  const isItemLoaded = (index: number) => index < items.length;
  const loadMoreItems = (_startIndex: number, _stopIndex: number) =>
    Promise.resolve();

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = items[index];
    const profitRate =
      typeof item.profitRate === 'string'
        ? parseFloat(item.profitRate)
        : item.profitRate;

    let type: 'stock' | 'crypto' | 'gold';

    if ('stockCode' in item && item.stockCode) {
      type = 'stock';
    } else if ('coinCode' in item && item.coinCode) {
      type = 'crypto';
    } else {
      type = 'gold';
    }

    return (
      <div style={style} className="flex items-center border-b px-4">
        {showAllItems && (
          <div className="w-1/4 py-2 text-sm font-medium">
            {type === 'stock' ? '주식' : type === 'crypto' ? '암호화폐' : '금'}
          </div>
        )}
        <div
          className={`${showAllItems ? 'w-1/4' : 'w-1/3'} py-2 text-base font-semibold`}
        >
          {item.name}
        </div>
        <div
          className={`${showAllItems ? 'w-1/4' : 'w-1/3'} py-2 font-medium text-base text-right`}
        >
          {item.price.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원
        </div>
        <div
          className={`${showAllItems ? 'w-1/4' : 'w-1/3'} py-2 font-medium text-base text-right ${profitRate >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {profitRate.toFixed(2)}%
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 relative h-full pt-6 pb-24 font-suite">
      <div className="w-11/12 mx-auto h-5 bg-customDarkGreen absolute top-2 left-0 right-0"></div>
      <div className="absolute top-5 left-0 right-0 bottom-24 mx-auto w-10/12">
        <div
          ref={containerRef}
          className="bg-white overflow-hidden relative"
          style={{ height: 'calc(100% - 24px)' }}
        >
          <h2 className="text-xl font-bold pt-4 mb-1 px-4">
            {showAllItems
              ? '전체'
              : ['주식', '암호화폐', '금'][activeIndex ?? 0]}
          </h2>
          <div className="h-full pt-4 pb-10 overflow-y-auto">
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({
                onItemsRendered,
                ref,
              }: {
                onItemsRendered: any;
                ref: any;
              }) => (
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
