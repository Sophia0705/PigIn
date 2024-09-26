import React from 'react';
import DetailHeader from '../../components/DetailHeader';
import DetailPageGraph from '../../components/DetailPageGraph';
import BTCData from '../../../data/BTCData.json';
import CryptoItemsContainer from '../components/CryptoItemsContainer';

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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <DetailHeader title="가상화폐" />
      <div className="p-4 w-full max-w-md">
        <DetailPageGraph
          data={BTCData}
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
