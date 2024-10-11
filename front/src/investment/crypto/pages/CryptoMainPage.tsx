import React, { useState, useEffect } from 'react';
import DetailHeader from '../../components/DetailHeader';
import DetailPageGraph from '../../components/DetailPageGraph';
import CryptoItemsContainer from '../components/CryptoItemsContainer';
import {
  CryptoListData,
  CryptoChartData,
} from '../../../investment/interfaces/CryptoInterface';
import { getCryptoList } from '../../../api/investment/crypto/CryptoList';
import { getWeeklyCryptoChartData } from '../../../api/investment/crypto/CryptoChartData';

const CryptoMainPage: React.FC = () => {
  const [, setCryptoData] = useState<CryptoListData[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<CryptoChartData[]>([]);

  const fetchChartData = async (coinId: string) => {
    try {
      // 연봉 데이터 가져오기
      const weeklyData = await getWeeklyCryptoChartData(coinId, 'day');
      console.log('주간 차트 데이터:', weeklyData);
      setWeeklyChartData(weeklyData.reverse());
    } catch (error) {
      console.error('차트 데이터 가져오는데 오류 발생:', error);
    }
  };

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        const data = await getCryptoList(); // 가상화폐 목록 가져오기
        console.log('가상화폐 목록:', data); // 가져온 데이터 console에 표시
        setCryptoData(data);
        fetchChartData('KRW-BTC');
      } catch (error) {
        console.error('가상화폐 목록 가져오는 중 에러 발생:', error);
      }
    };

    fetchCryptoList();
  }, []);

  const chartData = weeklyChartData.map((dataPoint) => ({
    name: dataPoint.coin_bsop_date,
    value: dataPoint.coin_clpr,
  }));

  const latestValue = weeklyChartData.length
    ? weeklyChartData[weeklyChartData.length - 1].coin_clpr
    : 0;
  const previousValue =
    weeklyChartData.length > 1
      ? weeklyChartData[weeklyChartData.length - 2]?.coin_clpr || 0
      : 0;
  const percentageChange = previousValue
    ? (((latestValue - previousValue) / previousValue) * 100).toFixed(2)
    : '0.00';
  const formattedPercentageChange =
    Number(percentageChange) >= 0
      ? `+${percentageChange}%`
      : `${percentageChange}%`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <DetailHeader title="가상화폐" />
      <div className="p-4 w-full max-w-md">
        <DetailPageGraph
          data={chartData}
          subject="BTC"
          value={latestValue.toLocaleString()}
          percentageChange={formattedPercentageChange}
        />
      </div>
      <CryptoItemsContainer title="가상화폐"></CryptoItemsContainer>
    </div>
  );
};

export default CryptoMainPage;
