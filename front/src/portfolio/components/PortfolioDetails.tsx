import { useMemo, useRef, useEffect, useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

const PortfolioDetails: React.FC = () => {
  const { categories, activeIndex, isLoading, error } = usePortfolioStore();
  const [listHeight, setListHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const category = useMemo(
    () => (activeIndex !== undefined ? categories[activeIndex] : null),
    [categories, activeIndex]
  );

  useEffect(() => {
    if (containerRef.current) {
      setListHeight(containerRef.current.clientHeight - 80);
    }
  }, []);

  if (isLoading)
    return <div className="text-center py-4">Loading details...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading details: {error}
      </div>
    );
  if (!category) return null;

  const itemCount = category.items.length;
  const isItemLoaded = (index: number) => index < category.items.length;
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
    const calculateTotalValue = (price: number, quantity: number) => {
      return (Number(price) * Number(quantity)).toLocaleString();
    };

    const item = category.items[index];
    // 카테고리별 종목(item)
    return (
      <div style={style} className="flex items-center border-b px-4">
        <div className="w-1/3 py-2 text-base font-semibold">{item.name}</div>
        <div className="w-1/3 text-right py-2 font-medium text-base">
          {Number.isInteger(item.quantity)
            ? item.quantity.toString()
            : item.quantity.toFixed(3)}
        </div>
        <div className="w-1/3 text-right py-2 text-sm">
          <div>{calculateTotalValue(item.price, item.quantity)}원</div>
          <div
            className={`${item.profitRate >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {(item.profitRate * 100).toFixed(1)}%{' '}
            {item.profitRate >= 0 ? '▲' : '▼'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 relative h-full pt-6 pb-24">
      {/* 얇은 녹색 막대 */}
      <div className="w-11/12 mx-auto h-4 bg-customDarkGreen absolute top-2 left-0 right-0"></div>

      {/* 흰색 박스와 회색 원들을 포함하는 컨테이너 */}
      <div className="absolute top-4 left-0 right-0 bottom-24 mx-auto w-10/12">
        {/* 흰색 박스 */}
        <div
          ref={containerRef}
          className="bg-white overflow-hidden relative"
          style={{ height: 'calc(100% - 24px)' }}
        >
          <h2 className="text-xl font-bold pt-4 mb-4 px-4">{category.name}</h2>
          {/* 안쪽만 스크롤 */}
          <div className="h-full pt-4 pb-10 overflow-y-auto">
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }: any) => (
                <List
                  height={listHeight}
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

          {/* 회색 원 8개 */}
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
