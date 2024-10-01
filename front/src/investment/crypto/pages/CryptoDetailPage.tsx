import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { CgChevronLeft, CgCheckR, CgAddR } from 'react-icons/cg';
import { CryptoItemData } from '../../interfaces/CryptoInterface';
import CryptoPurchaseModal from '../components/modals/CryptoPurchaseModal';
import CryptoDetailGraph from '../components/CryptoDetailGraph';
import CryptoDetailInfo from '../components/CryptoDetailInfo';
import CryptoNews from '../components/CryptoNews';
import CryptoSellModal from '../components/modals/CryptoSellModal';
import { format, subDays } from 'date-fns';

const CryptoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cryptoData] = useState<CryptoItemData>(location.state?.item);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7일');
  const [selectedInfoType, setSelectedInfoType] = useState<string>('상세정보');

  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [buyInputValue, setBuyInputValue] = useState<string>('00');
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [sellInputValue, setSellInputValue] = useState<string>('00');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToPortfolio = () => {
    setIsAdded((prevAdded) => !prevAdded);
    console.log(
      isAdded
        ? `${cryptoData?.coinName} 제거 완료!`
        : `${cryptoData?.coinName} 추가 완료!`
    );
  };

  const handleTimeRangeChange = (option: string) => {
    setSelectedTimeRange(option);
  };

  const handleInfoTypeChange = (option: string) => {
    setSelectedInfoType(option);
  };

  const handleHeartClick = () => {
    setIsLiked((prevLiked) => !prevLiked);
  };

  const handleBuyClick = () => {
    setIsBuyModalVisible(true);
  };

  const handleBuyModalClose = () => {
    setIsBuyModalVisible(false);
    setBuyInputValue('00');
  };

  const handleSellClick = () => {
    setIsSellModalVisible(true);
  };

  const handleSellModalClose = () => {
    setIsSellModalVisible(false);
    setSellInputValue('00');
  };

  if (!cryptoData) {
    return <div>로딩중...</div>;
  }

  const latestValue = cryptoData.weeklyPrices.length
    ? cryptoData.weeklyPrices[cryptoData.weeklyPrices.length - 1]
    : 0;

  const previousValue =
    cryptoData.weeklyPrices.length > 1
      ? cryptoData.weeklyPrices[cryptoData.weeklyPrices.length - 2] || 0
      : 0;

  const percentageChange = previousValue
    ? (((latestValue - previousValue) / previousValue) * 100).toFixed(2)
    : '0.00';

  const formattedPercentageChange =
    Number(percentageChange) >= 0
      ? `+${percentageChange}%`
      : `${percentageChange}%`;

  const selectedData =
    selectedTimeRange === '7일'
      ? cryptoData.weeklyPrices
      : selectedTimeRange === '1개월'
        ? cryptoData.monthlyPrices
        : selectedTimeRange === '1년'
          ? cryptoData.yearlyPrices
          : cryptoData.weeklyPrices;

  const chartData = selectedData
    ?.map((price, index) => {
      const currentDate = new Date();
      if (selectedTimeRange === '1년') {
        const pastDate = new Date(
          currentDate.setMonth(currentDate.getMonth() - index)
        );
        return {
          name: format(pastDate, 'yyyy-MM'),
          value: price,
        };
      } else {
        const pastDate = subDays(currentDate, index);
        return {
          name: format(pastDate, 'yyyy-MM-dd'),
          value: price,
        };
      }
    })
    .reverse();

  const minPrice = Math.min(...(selectedData || []));
  const maxPrice = Math.max(...(selectedData || []));

  const padding = (maxPrice - minPrice) * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;

  return (
    <div className="min-h-screen w-full flex flex-col bg-customDarkGreen">
      <div className="flex justify-between items-center p-4 w-full">
        <div onClick={handleBackClick} className="text-white">
          <CgChevronLeft size={24} />
        </div>
        <h1 className="text-xl font-bold text-center text-white">
          {cryptoData.coinName}
        </h1>
        <div className="flex items-center space-x-4 text-white">
          <div onClick={handleHeartClick}>
            {isLiked ? <FaHeart size={26} /> : <FaRegHeart size={26} />}
          </div>
          <div onClick={handleAddToPortfolio}>
            {isAdded ? <CgCheckR size={28} /> : <CgAddR size={28} />}
          </div>
        </div>
      </div>

      {/* 가상화폐 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white text-left ml-4">
            {cryptoData.price.toLocaleString()}
          </h1>
          <span
            className={`mr-4 mt-2 text-md font-normal px-2 py-1 rounded-full ${
              Number(percentageChange) > 0
                ? 'bg-green-900 text-white'
                : 'bg-green-100 text-black'
            }`}
          >
            {formattedPercentageChange}
          </span>
        </div>
      </div>

      {/* 시간 범위 선택 바 */}
      <div className="relative flex justify-center mt-6 mb-4 w-fit bg-green-100 rounded-full mx-auto">
        {['실시간', '7일', '1개월', '1년'].map((option) => (
          <button
            key={option}
            onClick={() => handleTimeRangeChange(option)}
            className={`px-6 py-2 rounded-full focus:outline-none transition-colors ${
              selectedTimeRange === option
                ? 'bg-customDarkGreen text-white font-extrabold'
                : 'bg-transparent text-gray-700 font-extrabold'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 그래프 */}
      <CryptoDetailGraph
        chartData={chartData}
        adjustedMin={adjustedMin}
        adjustedMax={adjustedMax}
      />

      {/* 상세정보, 뉴스 선택 바 */}
      <div className="relative flex justify-center mt-6 mb-4 w-fit bg-green-100 rounded-full mx-auto">
        {['상세정보', '뉴스'].map((option) => (
          <button
            key={option}
            onClick={() => handleInfoTypeChange(option)}
            className={`px-6 py-2 rounded-full focus:outline-none transition-colors ${
              selectedInfoType === option
                ? 'bg-customDarkGreen text-white font-extrabold'
                : 'bg-transparent text-gray-700 font-extrabold'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 가상화폐 정보 */}
      {selectedInfoType === '상세정보' && (
        <CryptoDetailInfo cryptoData={cryptoData} />
      )}

      {/* 뉴스 */}
      {selectedInfoType === '뉴스' && <CryptoNews />}

      {/* 매수, 매도 버튼 */}
      <div className="mt-6 flex justify-between w-10/12 mx-auto">
        <button
          className="w-1/2 bg-green-500 text-white py-2 rounded-lg mr-2"
          onClick={handleBuyClick}
        >
          매수
        </button>
        <button
          className="w-1/2 bg-red-500 text-white py-2 rounded-lg ml-2"
          onClick={handleSellClick}
        >
          매도
        </button>
      </div>

      {/* 매수 모달 */}
      {isBuyModalVisible && (
        <CryptoPurchaseModal
          inputValue={buyInputValue}
          setInputValue={setBuyInputValue}
          onClose={handleBuyModalClose}
          cryptoName={cryptoData.coinName}
          cryptoPrice={cryptoData.price}
        />
      )}

      {/* 매도 모달 */}
      {isSellModalVisible && (
        <CryptoSellModal
          inputValue={sellInputValue}
          setInputValue={setSellInputValue}
          onClose={handleSellModalClose}
          cryptoName={cryptoData.coinName}
          cryptoPrice={cryptoData.price}
        />
      )}
    </div>
  );
};

export default CryptoDetailPage;
