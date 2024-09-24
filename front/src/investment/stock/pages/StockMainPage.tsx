import React from "react";
import DetailHeader from "../../components/DetailHeader";
import DetailPageGraph from "../../components/DetailPageGraph";
import KospiData from "../../../data/KospiData.json";
import StockItemsContainer from "../components/StockItemsContainer";

const StockMainPage: React.FC = () => {
  const latestValue = KospiData[KospiData.length - 1].value;
  const previousValue = KospiData[KospiData.length - 2]?.value || 0;
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
          data={KospiData}
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
