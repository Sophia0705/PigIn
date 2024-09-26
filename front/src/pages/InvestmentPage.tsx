import React from 'react';
import InvestMainHeader from '../investment/components/InvestMainHeader';
import InvestmentCard from '../investment/components/InvestmentCard';
import KospiData from '../data/KospiData.json';
import BTCData from '../data/BTCData.json';
import GoldData from '../data/GoldData.json';

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
  const kospiPercentageChange = calculatePercentageChange(KospiData);
  const btcPercentageChange = calculatePercentageChange(BTCData);
  const goldPercentageChange = calculatePercentageChange(GoldData);

  const kospiCurrentValue = getCurrentValue(KospiData);
  const btcCurrentValue = getCurrentValue(BTCData);
  const goldCurrentValue = getCurrentValue(GoldData);

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <InvestMainHeader />
      <div className="flex flex-col items-center w-screen max-w-lg">
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
          data={BTCData}
        />

        {/* 금 */}
        <InvestmentCard
          subject="금"
          title="국내 금"
          value={goldCurrentValue}
          percentageChange={goldPercentageChange}
          headerColor="bg-yellow-400"
          data={GoldData}
        />
      </div>
    </div>
  );
};

export default InvestmentPage;
