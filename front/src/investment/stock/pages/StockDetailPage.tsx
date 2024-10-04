import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { CgChevronLeft, CgCheckR, CgAddR } from 'react-icons/cg';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import { StockItemData } from '../../interfaces/StockInterface';
import StockDetailGraph from '../components/StockDetailGraph';
import StockDetailInfo from '../components/StockDetailInfo';
import StockPurchaseModal from '../components/modals/StockPurchaseModal';
import StockNews from '../components/StockNews';
import StockSellModal from '../components/modals/StockSellModal';
import StockLiveStream from '../components/StockLiveStream';
import AuthGuardClickable from '../../../member/components/AuthGuardClickable';

const StockDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stockData = location.state?.item as StockItemData;
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('실시간');
  const [selectedInfoType, setSelectedInfoType] = useState<string>('상세정보');

  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [buyInputValue, setBuyInputValue] = useState('00');
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [sellInputValue, setSellInputValue] = useState('00');

  const countZeros = (str: string): number => {
    return (str.match(/0/g) || []).length;
  };

  const isNegativeChange = stockData.prdy_ctrt.startsWith('-');
  const isZeroChange = countZeros(stockData.prdy_ctrt) === 3;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToPortfolio = () => {
    setIsAdded((prevAdded) => !prevAdded);
    console.log(
      isAdded
        ? `${stockData.hts_kor_isnm} 제거 완료!`
        : `${stockData.hts_kor_isnm} 추가 완료!`
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

  if (!stockData) {
    return <div>로딩중...</div>;
  }

  const selectedData =
    selectedTimeRange === '7일'
      ? stockData.weeklyPrices
      : selectedTimeRange === '1개월'
        ? stockData.monthlyPrices
        : selectedTimeRange === '1년'
          ? stockData.yearlyPrices
          : stockData.weeklyPrices;

  const chartData = selectedData
    .slice()
    .reverse()
    .map((price, index) => {
      const currentDate = new Date();
      const reverseIndex = selectedData.length - 1 - index;

      let pastDate: Date;
      if (selectedTimeRange === '1년') {
        // 년단위일 경우, 달에서 뺌
        pastDate = new Date(
          currentDate.setMonth(currentDate.getMonth() - reverseIndex)
        );
      } else {
        // 월, 일 단위일 경우 일에서 뺌
        pastDate = new Date(
          currentDate.setDate(currentDate.getDate() - reverseIndex)
        );
      }

      const formattedDate =
        selectedTimeRange === '1년'
          ? format(pastDate, 'yyyy-MM')
          : format(pastDate, 'yyyy-MM-dd');

      return {
        name: formattedDate,
        value: price,
      };
    });

  const minPrice = Math.min(...stockData.weeklyPrices);
  const maxPrice = Math.max(...stockData.weeklyPrices);

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
          {stockData.hts_kor_isnm}
        </h1>
        <div className="flex items-center space-x-4 text-white">
          <AuthGuardClickable onAuthSuccess={handleHeartClick}>
            <div onClick={handleHeartClick}>
              {isLiked ? <FaHeart size={26} /> : <FaRegHeart size={26} />}
            </div>
          </AuthGuardClickable>
          <AuthGuardClickable onAuthSuccess={handleAddToPortfolio}>
            <div onClick={handleAddToPortfolio}>
              {isAdded ? <CgCheckR size={28} /> : <CgAddR size={28} />}
            </div>
          </AuthGuardClickable>
        </div>
      </div>

      {/* 주식 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white text-left ml-4">
            {Number(stockData.stck_prpr).toLocaleString()}
            <span className="text-lg"> 원</span>
          </h1>
          <span
            className={`mr-2 mt-2 text-md font-normal px-2 py-1 rounded-full flex items-center ${
              isNegativeChange
                ? 'bg-green-100 text-customDarkGreen'
                : isZeroChange
                  ? 'bg-gray-300 text-gray-700'
                  : 'bg-green-900 text-white'
            }`}
          >
            {isZeroChange ? (
              <span></span>
            ) : isNegativeChange ? (
              <MdArrowDropDown />
            ) : (
              <MdArrowDropUp />
            )}
            {stockData.prdy_ctrt}%
          </span>
        </div>
      </div>

      {selectedTimeRange === '실시간' && <StockLiveStream />}

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
      <StockDetailGraph
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

      {/* 주식 정보 */}
      {selectedInfoType === '상세정보' && (
        <StockDetailInfo stockData={stockData} />
      )}

      {/* 뉴스 */}
      {selectedInfoType === '뉴스' && (
        <StockNews stockId={stockData.stck_shrn_iscd} />
      )}

      {/* 매수, 매도 버튼 */}
      <div className="mt-6 flex justify-between w-10/12 mx-auto">
        <AuthGuardClickable onAuthSuccess={handleBuyClick}>
          <button
            className="w-1/2 bg-green-500 text-white py-2 rounded-lg mr-2"
            onClick={handleBuyClick}
          >
            매수
          </button>
        </AuthGuardClickable>
        <AuthGuardClickable onAuthSuccess={handleSellClick}>
          <button
            className="w-1/2 bg-red-500 text-white py-2 rounded-lg ml-2"
            onClick={handleSellClick}
          >
            매도
          </button>
        </AuthGuardClickable>
      </div>
      {/* 매수 모달 */}
      {isBuyModalVisible && (
        <StockPurchaseModal
          inputValue={buyInputValue}
          setInputValue={setBuyInputValue}
          onClose={handleBuyModalClose}
          stockName={stockData.hts_kor_isnm}
          stockPrice={stockData.stck_prpr}
        />
      )}

      {/* 매도 모달 */}
      {isSellModalVisible && (
        <StockSellModal
          inputValue={sellInputValue}
          setInputValue={setSellInputValue}
          onClose={handleSellModalClose}
          stockName={stockData.hts_kor_isnm}
          stockPrice={stockData.stck_prpr}
        />
      )}
    </div>
  );
};

export default StockDetailPage;
