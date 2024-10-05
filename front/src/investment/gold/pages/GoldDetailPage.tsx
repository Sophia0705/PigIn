import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import { CgChevronLeft, CgCheckR, CgAddR } from 'react-icons/cg';
import GoldPurchaseModal from '../components/modals/GoldPurchaseModal';
import GoldSellModal from '../components/modals/GoldSellModal';
import GoldDetailGraph from '../components/GoldDetailGraph';
import GoldDetailInfo from '../components/GoldDetailInfo';
import GoldNews from '../components/GoldNews';
import getGoldData from '../../../api/investment/gold/GoldSpecificData';
import {
  getWeeklyGoldChartData,
  getMonthlyGoldChartData,
  getThreeMonthlyGoldChartData,
  getYearlyGoldChartData,
} from '../../../api/investment/gold/GoldChartData';
import {
  addGoldToFavorite,
  removeGoldFromFavorite,
  checkIfFavorite,
} from '../../../api/investment/gold/GoldFavorite';
import {
  GoldItemData,
  GoldChartDataResponse,
} from '../../interfaces/GoldInterface';
import AuthGuardClickable from '../../../member/components/AuthGuardClickable';

const GoldDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [goldData, setGoldData] = useState<GoldItemData>({} as GoldItemData);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7일');
  const [selectedInfoType, setSelectedInfoType] = useState<string>('상세정보');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [buyInputValue, setBuyInputValue] = useState<string>('00');
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [sellInputValue, setSellInputValue] = useState<string>('00');

  useEffect(() => {
    const fetchGoldData = async () => {
      try {
        const data = await getGoldData();
        console.log('금 정보:', data);
        setGoldData(data);
      } catch (error) {
        console.error('금 데이터 가져오는 중 에러 발생:', error);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const isFav = await checkIfFavorite();
        setIsFavorite(isFav);
      } catch (error) {
        console.error('즐겨찾기 상태 확인 오류핑:', error);
      }
    };

    fetchGoldData();
    checkFavoriteStatus();
  }, []);

  useEffect(() => {
    fetchChartData(selectedTimeRange);
  }, [selectedTimeRange]);

  const fetchChartData = async (timeRange: string) => {
    try {
      let responseData: GoldChartDataResponse[];

      switch (timeRange) {
        case '7일':
          responseData = await getWeeklyGoldChartData();
          break;
        case '1개월':
          responseData = await getMonthlyGoldChartData();
          break;
        case '3개월':
          responseData = await getThreeMonthlyGoldChartData();
          console.log(responseData);
          break;
        case '1년':
          responseData = await getYearlyGoldChartData();
          console.log(responseData);
          break;
        default:
          responseData = await getWeeklyGoldChartData();
          break;
      }

      const formattedData = responseData
        .map((entry) => ({
          name: entry.date,
          value: parseFloat(entry.close),
        }))
        .reverse();

      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching gold chart data:', error);
    }
  };

  const latestValue = chartData.length > 0 ? chartData[0].value : 0;
  const previousValue = chartData.length > 1 ? chartData[1].value : 0;
  const percentageChange = (
    ((latestValue - previousValue) / previousValue) *
    100
  ).toFixed(2);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToPortfolio = () => {
    setIsAdded((prevAdded) => !prevAdded);
    alert(isAdded ? '금 제거 완료!' : '금 추가 완료!');
  };

  const handleTimeRangeChange = (option: string) => {
    setSelectedTimeRange(option);
  };

  const handleInfoTypeChange = (option: string) => {
    setSelectedInfoType(option);
  };

  const handleHeartClick = async () => {
    try {
      if (isFavorite) {
        await removeGoldFromFavorite();
        setIsFavorite(false);
        alert('즐겨찾기에서 제거됨');
      } else {
        await addGoldToFavorite();
        setIsFavorite(true);
        alert('즐겨찾기에 추가됨');
      }
    } catch (error) {
      console.error('즐겨찾기 추가/삭제 오류:', error);
    }
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

  const minPrice = Math.min(...chartData.map((data) => data.value));
  const maxPrice = Math.max(...chartData.map((data) => data.value));

  const padding = (maxPrice - minPrice) * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;
  const isNegativeChange = Number(percentageChange) < 0;
  const isZeroChange = Number(percentageChange) === 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-customDarkGreen">
      <div className="flex justify-between items-center p-4 w-full">
        <div onClick={handleBackClick} className="text-white">
          <CgChevronLeft size={24} />
        </div>
        <h1 className="text-xl font-bold text-center text-white">금</h1>
        <div className="flex items-center space-x-4 text-white">
          <AuthGuardClickable onAuthSuccess={handleHeartClick}>
            <div onClick={handleHeartClick}>
              {isFavorite ? <FaHeart size={26} /> : <FaRegHeart size={26} />}
            </div>
          </AuthGuardClickable>
          <AuthGuardClickable onAuthSuccess={handleAddToPortfolio}>
            <div onClick={handleAddToPortfolio}>
              {isAdded ? <CgCheckR size={28} /> : <CgAddR size={28} />}
            </div>
          </AuthGuardClickable>
        </div>
      </div>

      {/* 금 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white text-left ml-4">
            {Number(goldData.close).toLocaleString()}원
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
            {percentageChange}%
          </span>
        </div>
      </div>

      {/* 시간 범위 선택 바 */}
      <div className="relative flex justify-center mt-6 mb-4 w-fit bg-green-100 rounded-full mx-auto">
        {['7일', '1개월', '3개월', '1년'].map((option) => (
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
      <GoldDetailGraph
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

      {/* 금 상세 정보 */}
      {selectedInfoType === '상세정보' && (
        <GoldDetailInfo goldData={goldData} />
      )}

      {/* 뉴스 */}
      {selectedInfoType === '뉴스' && <GoldNews />}

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
        <GoldPurchaseModal
          inputValue={buyInputValue}
          setInputValue={setBuyInputValue}
          onClose={handleBuyModalClose}
          goldPrice={latestValue}
        />
      )}

      {/* 매도 모달 */}
      {isSellModalVisible && (
        <GoldSellModal
          inputValue={sellInputValue}
          setInputValue={setSellInputValue}
          onClose={handleSellModalClose}
          goldPrice={latestValue}
        />
      )}
    </div>
  );
};

export default GoldDetailPage;
