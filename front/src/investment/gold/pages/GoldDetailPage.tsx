import React from "react";
import DetailHeader from "../../components/DetailHeader";
import DetailPageGraph from "../../components/DetailPageGraph";
import GoldData from "../../../data/GoldData.json";

const GoldDetailPage: React.FC = () => {
  const latestValue = GoldData[GoldData.length - 1].value;
  const previousValue = GoldData[GoldData.length - 2]?.value || 0;
  const percentageChange = (
    ((latestValue - previousValue) / previousValue) *
    100
  ).toFixed(2);
  const formattedPercentageChange =
    Number(percentageChange) >= 0
      ? `+${percentageChange}%`
      : `${percentageChange}%`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <DetailHeader title="금" />
      <div className="p-4 w-full max-w-md">
        <DetailPageGraph
          data={GoldData}
          subject="금"
          value={latestValue.toString()}
          percentageChange={formattedPercentageChange}
        />
      </div>
    </div>
  );
};

export default GoldDetailPage;
