import { useState, useEffect } from 'react';
import { StockItemData } from '../investment/interfaces/StockInterface';
import { getStockList } from '../api/investment/stock/StockList';
import { getIndividualStockData } from '../api/investment/stock/IndividualStockData';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../api/investment/stock/StockChartData';

export const useStockData = () => {
  const [stockData, setStockData] = useState<StockItemData[]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
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
    fetchStockData();
  }, [selectedOption]);

  return stockData;
};
