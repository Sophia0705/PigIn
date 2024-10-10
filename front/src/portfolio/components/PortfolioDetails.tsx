import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../../store/portfolioStore';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../../api/investment/stock/StockChartData';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../../api/investment/crypto/CryptoChartData';
import { getIndividualStockData } from '../../api/investment/stock/IndividualStockData';
import { getIndividualCryptoData } from '../../api/investment/crypto/IndividualCryptoData';

interface ItemData {
  name: string;
  price: number;
  amount?: number;
  quantity?: number;
  profitRate: number | string;
  stockCode?: string;
  coinCode?: string;
}

const PortfolioDetails: React.FC = () => {
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
  const navigate = useNavigate();
  const [loadingItem, setLoadingItem] = useState<boolean>(false);

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

  const handleItemClick = async (item: ItemData) => {
    setLoadingItem(true);
    try {
      if ('stockCode' in item && item.stockCode) {
        const stockData = await getIndividualStockData(item.stockCode);
        const weeklyPrices = await getWeeklyStockChartData(
          item.stockCode,
          'day'
        );
        const monthlyPrices = await getMonthlyStockChartData(
          item.stockCode,
          'day'
        );
        const yearlyPrices = await getYearlyStockChartData(
          item.stockCode,
          'month'
        );

        const completeStockData = {
          ...stockData,
          weeklyPrices: weeklyPrices.map((data) => Number(data.stck_clpr)),
          monthlyPrices: monthlyPrices.map((data) => Number(data.stck_clpr)),
          yearlyPrices: yearlyPrices.map((data) => Number(data.stck_clpr)),
        };

        navigate(`/investment/stock/${item.stockCode}`, {
          state: { item: completeStockData },
        });
      } else if ('coinCode' in item && item.coinCode) {
        const cryptoData = await getIndividualCryptoData(item.coinCode);
        const weeklyChartData = await getWeeklyCryptoChartData(
          item.coinCode,
          'day'
        );
        const monthlyChartData = await getMonthlyCryptoChartData(
          item.coinCode,
          'day'
        );
        const yearlyChartData = await getYearlyCryptoChartData(
          item.coinCode,
          'month'
        );

        const completeCryptoData = {
          ...cryptoData,
          weeklyPrices: weeklyChartData.map((data) => data.coin_clpr),
          monthlyPrices: monthlyChartData.map((data) => data.coin_clpr),
          yearlyPrices: yearlyChartData.map((data) => data.coin_clpr),
        };

        // 비트코인캐시, 이더리움클래식 가격 재조정
        if (item.coinCode === 'BTC-BCH' || item.coinCode === 'BTC-ETC') {
          const bitcoinData = await getIndividualCryptoData('KRW-BTC');
          const adjustedPrice = completeCryptoData.price * bitcoinData.price;
          completeCryptoData.price = Number(adjustedPrice.toFixed(0));
        }

        navigate(`/investment/cryptocurrency/${item.coinCode}`, {
          state: { item: completeCryptoData },
        });
      } else {
        // 금의 경우 추가 데이터 로딩 없이 직접 페이지로 이동
        navigate('/investment/gold');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // 에러 처리 (예: 에러 메시지 표시)
    } finally {
      setLoadingItem(false);
    }
  };

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
      <div
        style={style}
        className="flex items-center border-b px-4 cursor-pointer hover:bg-gray-100"
        onClick={() => handleItemClick(item)}
      >
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

  if (isLoading || loadingItem) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 relative h-full pt-6 pb-24 font-gmarket-sans">
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
