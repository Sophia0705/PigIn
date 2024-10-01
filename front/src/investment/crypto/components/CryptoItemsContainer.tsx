import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import {
  CryptoListData,
  CryptoItemData,
  CryptoChartData,
} from '../../interfaces/CryptoInterface';
import { getCryptoList } from '../../../api/investment/crypto/CryptoList';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../../../api/investment/crypto/CryptoChartData';
import { getIndividualCryptoData } from '../../../api/investment/crypto/IndividualCryptoData';

interface CryptoItemsContainerProps {
  title: string;
}

const CryptoItemsContainer: React.FC<CryptoItemsContainerProps> = () => {
  const [selectedOption, setSelectedOption] = useState<string>('가격'); // 정렬 옵션 상태
  const [cryptoData, setCryptoData] = useState<CryptoItemData[]>([]); // 최종 가상화폐 데이터를 저장할 상태
  const [sortedData, setSortedData] = useState<CryptoItemData[]>([]); // 정렬된 데이터를 저장할 상태
  const navigate = useNavigate();

  // 가상화폐 목록, 각각의 상세정보, 주간 차트 데이터를 가져오는 함수
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // 1. 가상화폐 목록을 가져옴
        const cryptoList: CryptoListData[] = await getCryptoList();

        // 2. 각 가상화폐에 대해 개별 상세정보 및 주간 차트 데이터를 가져옴
        const finalCryptoData = await Promise.all(
          cryptoList.map(async (crypto) => {
            try {
              // 개별 가상화폐의 상세 정보를 가져옴
              const details: CryptoItemData = await getIndividualCryptoData(
                crypto.coinCode
              );

              // 개별 가상화폐의 기간별 차트 데이터를 가져옴
              const weeklyChartData: CryptoChartData[] =
                await getWeeklyCryptoChartData(crypto.coinCode, 'day');
              const monthlyChartData: CryptoChartData[] =
                await getMonthlyCryptoChartData(crypto.coinCode, 'day');
              const yearlyChartData: CryptoChartData[] =
                await getYearlyCryptoChartData(crypto.coinCode, 'month');

              // 목록 데이터, 상세 정보, 주간 차트 데이터를 합쳐서 반환
              return {
                ...crypto,
                ...details,
                weeklyPrices: weeklyChartData.map((data) => data.coin_clpr), // 주간 종가를 추출하여 weeklyPrices에 저장
                monthlyPrices: monthlyChartData.map((data) => data.coin_clpr), // 월간 종가를 추출하여 monthlyPrices에 저장
                yearlyPrices: yearlyChartData.map((data) => data.coin_clpr), // 연간 종가를 추출하여 yearlyPrices에 저장
              };
            } catch (error) {
              console.error(
                '가상화폐 상세 정보 또는 차트 데이터를 가져오는 중 오류 발생:',
                error
              );
              return null;
            }
          })
        );

        // 오류로 인해 null인 데이터를 제외하고 상태에 설정
        const validCryptoData = finalCryptoData.filter((item) => item !== null);
        setCryptoData(validCryptoData); // 최종 데이터를 상태에 저장
      } catch (error) {
        console.error('가상화폐 목록을 가져오는 중 오류 발생:', error);
      }
    };

    fetchCryptoData();
  }, []);

  // 선택한 옵션에 따라 데이터를 정렬하는 로직
  useEffect(() => {
    const sortedCryptos = [...cryptoData].sort((a, b) => {
      switch (selectedOption) {
        case '가격':
          return b.price - a.price;
        case '거래량':
          return b.volume - a.volume;
        case '등락률':
          return b.priceChange - a.priceChange;
        case '거래대금':
          return b.volume * b.price - a.volume * a.price; // 거래대금 = 거래량 * 현재가
        default:
          return 0;
      }
    });
    setSortedData(sortedCryptos); // 정렬된 데이터를 상태에 저장
  }, [selectedOption, cryptoData]);

  // 정렬 옵션 변경 핸들러
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  // 개별 가상화폐 클릭 시 상세 페이지로 이동
  const handleItemClick = (item: CryptoItemData) => {
    navigate(`/investment/cryptocurrency/${item.coin}`, {
      state: { item },
    });
  };

  return (
    <div className="flex-grow bg-white rounded-t-3xl mt-4 p-4 shadow-md w-full">
      <div className="relative flex justify-center mt-6 mb-4 bg-green-100 rounded-full">
        {['가격', '거래량', '등락률', '거래대금'].map((option) => (
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
        {sortedData.map((item: CryptoItemData) => (
          <div
            key={item.coin}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer flex-shrink-0 w-64 h-70"
          >
            <CryptoItem
              name={item.coinName}
              price={item.price}
              priceChange={item.priceChange}
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

export default CryptoItemsContainer;
