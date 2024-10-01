import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { CgChevronLeft } from 'react-icons/cg';
import StockSearchResults from '../components/StockSearchResults';
import {
  getWeeklyStockChartData,
  getMonthlyStockChartData,
  getYearlyStockChartData,
} from '../../../api/investment/stock/StockChartData';
import { searchStocks } from '../../../api/investment/stock/StockSearch';
import {
  StockItemData,
  StockListResponse,
} from '../../interfaces/StockInterface';

const StockSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
  const [filteredStocks, setFilteredStocks] = useState<StockItemData[]>([]);

  const navigate = useNavigate();

  // 입력값 변환시키는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsSearchTriggered(false);
  };

  // 이전 페이지로 이동하는 함수
  const handleBack = () => {
    navigate(-1);
  };

  // 검색기록 추가 및 검색 api 호출하는 함수
  const handleSearch = async () => {
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory([...searchHistory, searchQuery]);
      setIsSearchTriggered(true);

      try {
        const results = await searchStocks(searchQuery);
        console.log(results);

        const enrichedResults = await Promise.all(
          results.map(async (stock: StockListResponse) => {
            try {
              const [weeklyData, monthlyData, yearlyData] = await Promise.all([
                getWeeklyStockChartData(stock.stockCode, 'day'),
                getMonthlyStockChartData(stock.stockCode, 'day'),
                getYearlyStockChartData(stock.stockCode, 'month'),
              ]);

              return {
                hts_kor_isnm: stock.stockName,
                stck_shrn_iscd: stock.stockCode,
                stck_prpr: parseInt(stock.price),
                prdy_ctrt: stock.priceChange.toString(),
                weeklyPrices: weeklyData.map((data: { stck_clpr: string }) =>
                  parseFloat(data.stck_clpr)
                ),
                monthlyPrices: monthlyData.map((data: { stck_clpr: string }) =>
                  parseFloat(data.stck_clpr)
                ),
                yearlyPrices: yearlyData.map((data: { stck_clpr: string }) =>
                  parseFloat(data.stck_clpr)
                ),
              };
            } catch (error) {
              console.error(
                `Error fetching chart data for stock ${stock.stockCode}:`,
                error
              );
              return null;
            }
          })
        );
        const validResults = enrichedResults.filter(
          (result) => result !== null
        ) as StockItemData[];

        setFilteredStocks(validResults);
      } catch (error) {
        console.error('주식 데이터 불러오는 중 오류 발생:', error);
      }
    }
  };

  // 검색기록 삭제하는 함수
  const handleDeleteHistoryItem = (item: string) => {
    setSearchHistory(
      searchHistory.filter((historyItem) => historyItem !== item)
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-start p-4 w-full">
      <div className="flex items-center justify-start w-full p-0 mb-4 space-x-2">
        {/* 뒤로가기 버튼 */}
        <div onClick={handleBack} className="self-start mt-2 text-white">
          <CgChevronLeft size={24} />
        </div>

        {/* 검색 바 */}
        <div className="relative flex-grow w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            placeholder="검색어를 입력하세요"
            className="w-full p-2 pl-4 pr-10 border-2 border-gray-300 rounded-full focus:outline-none focus:border-customDarkGreen"
          />
          <FaSearch
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 검색 기록 */}
      <div className="flex flex-wrap gap-2 w-full max-w-md mt-4">
        {searchHistory.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-lg"
          >
            <span>{item}</span>
            <div
              onClick={() => handleDeleteHistoryItem(item)}
              className="ml-2 text-gray-500"
            >
              <FaTimes />
            </div>
          </div>
        ))}
      </div>

      {/* 검색 결과 */}
      {isSearchTriggered && (
        <StockSearchResults filteredStocks={filteredStocks} />
      )}
    </div>
  );
};

export default StockSearchPage;
