import React from "react";
import DetailHeader from "../../components/DetailHeader";
import DetailPageGraph from "../../components/DetailPageGraph";
import BTCData from "../../../data/BTCData.json";
import ItemsContainer from "../../components/ItemsContainer";

const CryptoMainPage: React.FC = () => {
  const latestValue = BTCData[BTCData.length - 1].value;
  const previousValue = BTCData[BTCData.length - 2]?.value || 0;
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
      <DetailHeader title="가상화폐" />
      <div className="p-4 w-full max-w-md">
        <DetailPageGraph
          data={BTCData}
          subject="BTC"
          value={latestValue.toString()}
          percentageChange={formattedPercentageChange}
        />
      </div>
      <ItemsContainer title="가상화폐" type="crypto"></ItemsContainer>
    </div>
  );
};

export default CryptoMainPage;
