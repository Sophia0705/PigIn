import React, { useEffect, useState } from 'react';
import InvestMainHeader from '../investment/components/InvestMainHeader';
import InvestmentCard from '../investment/components/InvestmentCard';
import KospiData from '../data/KospiData.json';
import { getWeeklyCryptoChartData } from '../api/investment/crypto/CryptoChartData';
import { getWeeklyGoldChartData } from '../api/investment/gold/GoldChartData';
import { GoldChartDataResponse } from '../investment/interfaces/GoldInterface';

const calculatePercentageChange = (data: { name: string; value: number }[]) => {
  const lastTwoValues = data.slice(-2);
  if (lastTwoValues.length < 2) return '0.00%';

  const [secondLastValue, lastValue] = lastTwoValues;
  const change =
    ((lastValue.value - secondLastValue.value) / secondLastValue.value) * 100;
  return `${change.toFixed(2)}%`;
};

const getCurrentValue = (data: { name: string; value: number }[]) => {
  const lastValue = data[data.length - 1];
  return lastValue ? lastValue.value.toLocaleString() : '0';
};

const InvestmentPage: React.FC = () => {
  const [btcData, setBtcData] = useState<{ name: string; value: number }[]>([]);
  const [goldWeeklyData, setGoldWeeklyData] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    const fetchBTCData = async () => {
      try {
        const weeklyData = await getWeeklyCryptoChartData('KRW-BTC', 'day');

        const formattedData = weeklyData.reverse().map((data) => ({
          name: data.coin_bsop_date,
          value: data.coin_clpr,
        }));
        setBtcData(formattedData);
      } catch (error) {
        console.error('비트코인 데이터 가져오는 중 에러 발생:', error);
      }
    };

    const fetchGoldData = async () => {
      try {
        const weeklyData = await getWeeklyGoldChartData();

        const formatData = (data: GoldChartDataResponse[]) =>
          data
            .map((item) => ({
              name: item.date,
              value: parseFloat(item.close),
            }))
            .reverse();

        setGoldWeeklyData(formatData(weeklyData));

        console.log('금 주간 데이터:', weeklyData);
      } catch (error) {
        console.error('금 데이터 가져오는 중 에러 발생:', error);
      }
    };

    fetchBTCData();
    fetchGoldData();
  }, []);

  const kospiPercentageChange = calculatePercentageChange(KospiData);
  const goldPercentageChange = calculatePercentageChange(goldWeeklyData);
  const btcPercentageChange = btcData.length
    ? calculatePercentageChange(btcData)
    : '0.00%';

  const kospiCurrentValue = getCurrentValue(KospiData);
  const goldCurrentValue = getCurrentValue(goldWeeklyData);
  const btcCurrentValue = btcData.length ? getCurrentValue(btcData) : '0';

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <InvestMainHeader />
      <div className="flex flex-col items-center w-full max-w-md">
        {/* 주식 */}
        <InvestmentCard
          subject="주식"
          title="KOSPI"
          value={kospiCurrentValue}
          percentageChange={kospiPercentageChange}
          headerColor="bg-customAqua"
          data={KospiData}
        />

        {/* 가상화폐 */}
        <InvestmentCard
          subject="가상화폐"
          title="BTC"
          value={btcCurrentValue}
          percentageChange={btcPercentageChange}
          headerColor="bg-blue-500"
          data={btcData}
        />

        {/* 금 */}
        <InvestmentCard
          subject="금"
          title="국내 금"
          value={goldCurrentValue}
          percentageChange={goldPercentageChange}
          headerColor="bg-yellow-400"
          data={goldWeeklyData}
        />
      </div>
    </div>
  );
};

export default InvestmentPage;
