import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockItem from './StockItem';
import { getStockList } from '../../../api/investment/stock/StockList';
import { StockItemData } from '../../interfaces/StockInterface';
import { getIndividualStockData } from '../../../api/investment/stock/IndividualStockData';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../../../api/investment/stock/StockChartData';

interface StockItemsContainerProps {
  title: string;
}

const StockItemsContainer: React.FC<StockItemsContainerProps> = () => {
  const [selectedOption, setSelectedOption] = useState<string>('시가총액');
  const [sortedData, setSortedData] = useState<StockItemData[]>([]);
  const navigate = useNavigate();

  const fetchStockList = async () => {
    try {
      // 주식 목록 가져오기
      const stockList = await getStockList();
      console.log('주식 전체 목록:', stockList);

      // 주식별 상세정보
      const combinedStockData = await Promise.all(
        stockList.map(async (stock) => {
          // 단일 주식 상세정보
          const stockData = await getIndividualStockData(stock.stockCode);

          const weeklyPrices = await getWeeklyStockChartData(
            stock.stockCode,
            'day'
          );
          const monthlyPrices = await getMonthlyStockChartData(
            stock.stockCode,
            'day'
          );
          const yearlyPrices = await getYearlyStockChartData(
            stock.stockCode,
            'month'
          );

          const weeklyClosingPrices = weeklyPrices.map((data) =>
            Number(data.stck_clpr)
          );
          const monthlyClosingPrices = monthlyPrices.map((data) =>
            Number(data.stck_clpr)
          );
          const yearlyClosingPrices = yearlyPrices.map((data) =>
            Number(data.stck_clpr)
          );

          return {
            ...stockData,
            weeklyPrices: weeklyClosingPrices,
            monthlyPrices: monthlyClosingPrices,
            yearlyPrices: yearlyClosingPrices,
          };
        })
      );

      console.log('최종 주식 데이터:', combinedStockData);
      setSortedData(combinedStockData);
      sortStockData(combinedStockData, selectedOption);
      return combinedStockData;
    } catch (error) {
      console.error('주식 정보나 차트 데이터 문제:', error);
    }
  };

  useEffect(() => {
    fetchStockList();
  }, [selectedOption]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const sortStockData = (data: StockItemData[], option: string) => {
    const sorted = [...data].sort((a, b) => {
      switch (option) {
        case '시가총액':
          return parseInt(b.hts_avls) - parseInt(a.hts_avls);
        case '거래량':
          return parseInt(b.acml_vol) - parseInt(a.acml_vol);
        case '등락률':
          return parseFloat(b.prdy_ctrt) - parseFloat(a.prdy_ctrt);
        case '거래대금':
          return (
            parseInt(b.acml_vol) * b.stck_prpr -
            parseInt(a.acml_vol) * a.stck_prpr
          ); // 거래대금 = 거래량 * 현재가
        default:
          return 0;
      }
    });
    setSortedData(sorted);
  };

  const handleItemClick = (item: StockItemData) => {
    navigate(`/investment/stock/${item.stck_shrn_iscd}`, {
      state: { item },
    });
  };

  return (
    <div className="flex-grow bg-white rounded-t-3xl mt-4 p-4 shadow-md w-full">
      <div className="relative flex justify-center mt-6 mb-4 bg-green-100 rounded-full">
        {['시가총액', '거래량', '등락률', '거래대금'].map((option) => (
          <button
            key={option}
            onClick={() => handleOptionChange(option)}
            className={`px-4 py-2 rounded-full focus:outline-none transition-colors ${
              selectedOption === option
                ? 'bg-customDarkGreen text-white font-extrabold'
                : 'bg-transparent text-gray-700 font-extrabold'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex flex-row overflow-x-auto space-x-4 w-80 max-w-full mx-auto flex-nowrap">
        {sortedData.map((item: StockItemData) => (
          <div
            key={item.stck_shrn_iscd}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer flex-shrink-0 w-64 h-70"
          >
            <StockItem
              name={item.hts_kor_isnm}
              price={Number(item.stck_prpr)}
              percentageChange={item.prdy_ctrt}
              weeklyPrices={item.weeklyPrices}
              monthlyPrices={item.monthlyPrices}
              yearlyPrices={item.yearlyPrices}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockItemsContainer;
