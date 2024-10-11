import React, { useState, useEffect } from 'react';
import DetailHeader from '../../components/DetailHeader';
import DetailPageGraph from '../../components/DetailPageGraph';
import { getKospiChartData } from '../../../api/investment/stock/StockChartData';
import StockItemsContainer from '../components/StockItemsContainer';

const StockMainPage: React.FC = () => {
  const [kospiData, setKospiData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const fetchKospiData = async () => {
      try {
        const apiData = await getKospiChartData(20);
        console.log(apiData);
        const formattedData = apiData
          .map((item) => ({
            name: item.stck_bsop_date,
            value: parseFloat(item.stck_clpr),
          }))
          .reverse();
        setKospiData(formattedData);
      } catch (error) {
        console.error('KOSPI 데이터 가져오는 중 에러 발생:', error);
      }
    };

    fetchKospiData();
  }, []);

  const latestValue =
    kospiData.length > 0 ? kospiData[kospiData.length - 1].value : 0;
  const previousValue =
    kospiData.length > 1 ? kospiData[kospiData.length - 2].value : 0;

  const percentageChange = (
    ((latestValue - previousValue) / previousValue) *
    100
  ).toFixed(2);
  const formattedPercentageChange =
    Number(percentageChange) > 0
      ? `+${percentageChange}%`
      : `${percentageChange}%`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      {/* 상단 헤더 */}
      <DetailHeader title="주식" />
      <div className="p-4 w-full max-w-md">
        {/* 그래프 */}
        <DetailPageGraph
          data={kospiData}
          subject="KOSPI"
          value={latestValue.toString()}
          percentageChange={formattedPercentageChange}
        />
      </div>
      {/* 상세 주식 항목들 */}
      <StockItemsContainer title="주식" />
    </div>
  );
};

export default StockMainPage;
