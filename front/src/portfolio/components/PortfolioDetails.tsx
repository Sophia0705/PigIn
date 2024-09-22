import { useMemo, useRef, useEffect, useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

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
      setListHeight(containerRef.current.clientHeight - 80); // 80px for padding and header
    }
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading details...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading details: {error}</div>;
  if (!category) return null;

  const itemCount = category.items.length;
  const isItemLoaded = (index: number) => index < category.items.length;
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    return Promise.resolve();
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = category.items[index];
    return (
      <div style={style} className="flex items-center border-b px-4">
        <div className="w-1/4 py-2 text-sm">{item.name}</div>
        <div className="w-1/4 text-right py-2 text-sm">{item.quantity.toFixed(8)}</div>
        <div className="w-1/4 text-right py-2 text-sm">{item.price.toLocaleString()}원</div>
        <div className={`w-1/4 text-right py-2 text-sm ${item.profitRate >= 0 ? "text-green-500" : "text-red-500"}`}>
          {(item.profitRate * 100).toFixed(2)}% {item.profitRate >= 0 ? "▲" : "▼"}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 relative h-full pt-6">
      {/* 얇은 녹색 막대 */}
      <div className="w-11/12 mx-auto h-4 bg-customDarkGreen absolute top-2 left-0 right-0"></div>
     
      {/* 흰색 박스 */}
      <div ref={containerRef} className="absolute top-4 left-0 right-0 bottom-16 mx-auto w-10/12 bg-white overflow-hidden">
        {/* 안쪽만 스크롤 */}
        <div className="h-full pt-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 px-4">{category.name} 상세 내역</h2>
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
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
      </div>
      {/* 회색 원 6개 */}
      <div className="absolute bottom-0 left-0 right-0 px-16">
        <div className="flex justify-between items-center h-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-gray-100 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;