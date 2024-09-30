import React, { useState, useEffect } from 'react';
import DetailHeader from '../../components/DetailHeader';
import DetailPageGraph from '../../components/DetailPageGraph';
import BTCData from '../../../data/BTCData.json';
import CryptoItemsContainer from '../components/CryptoItemsContainer';
import { CryptoListData } from '../../../investment/interfaces/CryptoInterface';
import { getCryptoList } from '../../../api/investment/crypto/CryptoList';

const CryptoMainPage: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoListData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoList = async () => {
      try {
        setLoading(true);
        const data = await getCryptoList(); // 가상화폐 목록 가져오기
        console.log('가상화폐 목록:', data); // 가져온 데이터 console에 표시
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.error('가상화폐 목록 가져오는 중 에러 발생:', error);
        setError('Failed to fetch cryptocurrency list.');
        setLoading(false);
      }
    };

    fetchCryptoList();
  }, []);

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
