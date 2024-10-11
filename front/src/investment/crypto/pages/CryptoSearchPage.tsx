import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { CgChevronLeft } from 'react-icons/cg';
import CryptoSearchResults from '../components/CryptoSearchResults';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../../../api/investment/crypto/CryptoChartData';
import { searchCryptos } from '../../../api/investment/crypto/CryptoSearch';
import { getIndividualCryptoData } from '../../../api/investment/crypto/IndividualCryptoData';
import {
  CryptoItemData,
  CryptoListData,
} from '../../interfaces/CryptoInterface';

const CryptoSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoItemData[]>([]);
  const [bitcoinPrice, setBitcoinPrice] = useState<number>(0);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const bitcoinData = await getIndividualCryptoData('KRW-BTC');
        setBitcoinPrice(bitcoinData.close);
      } catch (error) {
        console.error('비트코인 가격을 가져오는 중 오류 발생:', error);
      }
    };
    fetchBitcoinPrice();
  }, []);

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

  // 검색기록 추가 및 검색 API 호출하는 함수
  const handleSearch = async () => {
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory([...searchHistory, searchQuery]);
      setIsSearchTriggered(true);

      try {
        const results = await searchCryptos(searchQuery);
        console.log(results);

        const enrichedResults = await Promise.all(
          results.map(async (crypto: CryptoListData) => {
            try {
              const [weeklyData, monthlyData, yearlyData] = await Promise.all([
                getWeeklyCryptoChartData(crypto.coin, 'day'),
                getMonthlyCryptoChartData(crypto.coin, 'day'),
                getYearlyCryptoChartData(crypto.coin, 'month'),
              ]);

              return {
                coinName: crypto.coinName,
                coin: crypto.coin,
                price: parseFloat(crypto.price),
                priceChange: crypto.priceChange,
                weeklyPrices: weeklyData.map((data) => data.coin_clpr),
                monthlyPrices: monthlyData.map((data) => data.coin_clpr),
                yearlyPrices: yearlyData.map((data) => data.coin_clpr),
              };
            } catch (error) {
              console.error(
                `Error fetching chart data for crypto ${crypto.coin}:`,
                error
              );
              return null;
            }
          })
        );

        const validResults = enrichedResults.filter(
          (result) => result !== null
        ) as CryptoItemData[];

        setFilteredCryptos(validResults);
      } catch (error) {
        console.error('암호화폐 데이터 불러오는 중 오류 발생:', error);
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
    <div className="min-h-screen flex flex-col items-start justify-start p-4 w-full bg-customDarkGreen">
      <div className="flex items-center justify-start w-full mb-4 space-x-2 relative">
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
            className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
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

      {/* 검색결과 */}
      {isSearchTriggered && (
        <CryptoSearchResults
          filteredCryptos={filteredCryptos}
          bitcoinPrice={bitcoinPrice}
        />
      )}
    </div>
  );
};

export default CryptoSearchPage;
