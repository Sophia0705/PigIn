import { useMemo } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

const PortfolioDetails: React.FC = () => {
  const { categories, activeIndex, isLoading, error } = usePortfolioStore();

  const category = useMemo(
    () => (activeIndex !== undefined ? categories[activeIndex] : null),
    [categories, activeIndex]
  );

  if (isLoading) return <div>Loading details...</div>;
  if (error) return <div>Error loading details: {error}</div>;
  if (!category) return null;

  const itemCount = category.items.length;

  const isItemLoaded = (index: number) => index < category.items.length;

  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    return Promise.resolve();
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = category.items[index];
    return (
      <div style={style} className="flex items-center border-b">
        <div className="w-1/4 py-2">{item.name}</div>
        <div className="w-1/4 text-right py-2">{item.quantity.toFixed(8)}</div>
        <div className="w-1/4 text-right py-2">
          {item.price.toLocaleString()}원
        </div>
        <div
          className={`w-1/4 text-right py-2 ${item.profitRate >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {(item.profitRate * 100).toFixed(2)}%{" "}
          {item.profitRate >= 0 ? "↑" : "↓"}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">{category.name} 상세 내역</h3>
      <div className="flex items-center border-b font-bold">
        <div className="w-1/4 py-2">종목</div>
        <div className="w-1/4 text-right py-2">수량</div>
        <div className="w-1/4 text-right py-2">평가금액</div>
        <div className="w-1/4 text-right py-2">수익률</div>
      </div>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            height={400}
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
  );
};

export default PortfolioDetails;
