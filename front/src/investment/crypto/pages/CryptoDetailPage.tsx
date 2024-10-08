import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { CgChevronLeft, CgCheckR, CgAddR } from 'react-icons/cg';
import { CryptoItemData } from '../../interfaces/CryptoInterface';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import {
  checkIfFavorite,
  addToFavorite,
  removeFromFavorite,
} from '../../../api/investment/crypto/CryptoFavorite';
import {
  checkIfAutoInvest,
  addToAutoInvest,
  removeFromAutoInvest,
} from '../../../api/investment/crypto/CryptoAutoInvest';
import {
  getLiveCryptoChartData,
  getUpdatedLiveCryptoData,
} from '../../../api/investment/crypto/CryptoChartData';
import CryptoPurchaseModal from '../components/modals/CryptoPurchaseModal';
import CryptoDetailGraph from '../components/CryptoDetailGraph';
import CryptoDetailInfo from '../components/CryptoDetailInfo';
import CryptoNews from '../components/CryptoNews';
import CryptoSellModal from '../components/modals/CryptoSellModal';
import { format, subDays } from 'date-fns';
import { getIndividualCryptoData } from '../../../api/investment/crypto/IndividualCryptoData';
import AuthGuardClickable from '../../../member/components/AuthGuardClickable';

const CryptoDetailPage: React.FC = () => {
  interface LiveChartData {
    name: string;
    value: number;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [cryptoData] = useState<CryptoItemData>(location.state?.item);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7일');
  const [selectedInfoType, setSelectedInfoType] = useState<string>('상세정보');
  const [bitcoinPrice, setBitcoinPrice] = useState<number>(0);

  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [buyInputValue, setBuyInputValue] = useState<string>('00');
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [sellInputValue, setSellInputValue] = useState<string>('00');
  const [liveChartData, setLiveChartData] = useState<LiveChartData[]>([]);
  const [liveAdjustedMin, setLiveAdjustedMin] = useState<number | null>(null);
  const [liveAdjustedMax, setLiveAdjustedMax] = useState<number | null>(null);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const bitcoinData = await getIndividualCryptoData('KRW-BTC');
        setBitcoinPrice(bitcoinData.close);
      } catch (error) {
        console.error('비트코인 가격 가져오는데 오류 발생:', error);
      }
    };

    fetchBitcoinPrice();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const favoriteStatus = await checkIfFavorite(cryptoData.coin);
        setIsLiked(favoriteStatus.result);

        const autoInvestStatus = await checkIfAutoInvest(cryptoData.coin);
        setIsAdded(autoInvestStatus.result);
      } catch (error) {
        console.error('상태 확인 중 오류 발생:', error);
      }
    };

    fetchStatus();
  }, [cryptoData.coin]);

  useEffect(() => {
    let isMounted = true;

    if (selectedTimeRange === '실시간') {
      const fetchLiveData = async () => {
        try {
          const liveData = await getLiveCryptoChartData(
            cryptoData.coin,
            'minute',
            20
          );

          if (!isMounted) return;

          const formattedData = liveData
            .map((item) => ({
              name: `${item.coin_bsop_time.slice(0, 2)}:${item.coin_bsop_time.slice(2, 4)}`,
              value: Number(item.coin_clpr),
            }))
            .reverse();

          setLiveChartData(formattedData);

          const prices = formattedData.map((data) => data.value);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          const padding = (maxPrice - minPrice) * 0.1;
          setLiveAdjustedMin(minPrice - padding);
          setLiveAdjustedMax(maxPrice + padding);

          const updateLiveData = async () => {
            try {
              const updatedData = await getUpdatedLiveCryptoData(
                cryptoData.coin
              );
              if (!isMounted) return;
              console.log(updatedData);
              if (updatedData.live) {
                // 가장 최근 데이터 교체
                setLiveChartData((prevData) => [
                  ...prevData.slice(1),
                  {
                    name: `${updatedData.data.coin_bsop_time.slice(0, 2)}:${updatedData.data.coin_bsop_time.slice(2, 4)}`,
                    value: Number(updatedData.data.coin_clpr),
                  },
                ]);
              }
            } catch (error) {
              if (isMounted)
                console.error('실시간 차트 업데이트 가져오기 실패:', error);
            }
          };

          // 매 1분마다 업데이트 호출
          const intervalId = setInterval(updateLiveData, 60000);

          // interval 초기화
          return () => {
            clearInterval(intervalId);
            isMounted = false;
          };
        } catch (error) {
          if (isMounted)
            console.error('실시간 차트 업데이트 가져오기 실패:', error);
        }
      };
      fetchLiveData();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedTimeRange, cryptoData.coin]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToPortfolio = async () => {
    try {
      if (isAdded) {
        await removeFromAutoInvest(cryptoData.coin);
      } else {
        await addToAutoInvest(cryptoData.coin);
      }
      setIsAdded((prev) => !prev);
    } catch (error) {
      console.error('자동투자 목록 수정 중 오류 발생:', error);
    }
  };

  const handleTimeRangeChange = (option: string) => {
    setSelectedTimeRange(option);
  };

  const handleInfoTypeChange = (option: string) => {
    setSelectedInfoType(option);
  };

  const handleHeartClick = async () => {
    try {
      if (isLiked) {
        await removeFromFavorite(cryptoData.coin);
      } else {
        await addToFavorite(cryptoData.coin);
      }
      setIsLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error('찜 목록 수정 중 오류 발생:', error);
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

  const adjustPrice = (prices: number[]) => {
    const isBitcoinRelated =
      cryptoData.coinName === '비트코인캐시' ||
      cryptoData.coinName === '이더리움클래식';
    return isBitcoinRelated
      ? prices.map((price) => Math.round(price * bitcoinPrice))
      : prices;
  };

  const adjustedWeeklyPrices = adjustPrice(cryptoData.weeklyPrices);
  const adjustedMonthlyPrices = adjustPrice(cryptoData.monthlyPrices);
  const adjustedYearlyPrices = adjustPrice(cryptoData.yearlyPrices);

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
      ? adjustedWeeklyPrices
      : selectedTimeRange === '1개월'
        ? adjustedMonthlyPrices
        : selectedTimeRange === '1년'
          ? adjustedYearlyPrices
          : adjustedWeeklyPrices;

  const chartData = selectedData
    .slice()
    .reverse()
    .map((price, index) => {
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

  const isNegativeChange = Number(percentageChange) < 0;
  const isZeroChange = Number(percentageChange) === 0;

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

      {/* 가상화폐 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white text-left ml-4">
            {liveChartData.length > 0
              ? Number(
                  liveChartData[liveChartData.length - 1].value
                ).toLocaleString()
              : Number(latestValue).toLocaleString()}
            <span className="text-lg"> 원</span>
          </h1>
          <span
            className={`mr-4 mt-2 text-md font-normal px-2 py-1 rounded-full flex items-center ${
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
        chartData={selectedTimeRange === '실시간' ? liveChartData : chartData}
        adjustedMin={
          selectedTimeRange === '실시간'
            ? (liveAdjustedMin ?? adjustedMin)
            : adjustedMin
        }
        adjustedMax={
          selectedTimeRange === '실시간'
            ? (liveAdjustedMax ?? adjustedMax)
            : adjustedMax
        }
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
        <CryptoDetailInfo cryptoData={cryptoData} bitcoinPrice={bitcoinPrice} />
      )}

      {/* 뉴스 */}
      {selectedInfoType === '뉴스' && (
        <CryptoNews Date={''} NewsCompany={''} NewsTitle={''} Link={''} />
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
        <CryptoPurchaseModal
          inputValue={buyInputValue}
          setInputValue={setBuyInputValue}
          onClose={handleBuyModalClose}
          cryptoId={cryptoData.coin}
          cryptoName={cryptoData.coinName}
          cryptoPrice={
            liveChartData.length > 0
              ? Number(liveChartData[liveChartData.length - 1].value)
              : Number(cryptoData.price)
          }
        />
      )}

      {/* 매도 모달 */}
      {isSellModalVisible && (
        <CryptoSellModal
          inputValue={sellInputValue}
          setInputValue={setSellInputValue}
          onClose={handleSellModalClose}
          cryptoId={cryptoData.coin}
          cryptoPrice={
            liveChartData.length > 0
              ? Number(liveChartData[liveChartData.length - 1].value)
              : Number(cryptoData.price)
          }
        />
      )}
    </div>
  );
};

export default CryptoDetailPage;
