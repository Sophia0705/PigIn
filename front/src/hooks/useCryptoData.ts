import { useState, useEffect } from 'react';
import { CryptoItemData } from '../investment/interfaces/CryptoInterface';
import { getCryptoList } from '../api/investment/crypto/CryptoList';
import { getIndividualCryptoData } from '../api/investment/crypto/IndividualCryptoData';
import {
  getWeeklyCryptoChartData,
  getMonthlyCryptoChartData,
  getYearlyCryptoChartData,
} from '../api/investment/crypto/CryptoChartData';

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoItemData[]>([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        // 1. 가상화폐 목록을 가져옴
        const cryptoList: CryptoListData[] = await getCryptoList();

        // 2. 각 가상화폐에 대해 개별 상세정보 및 주간 차트 데이터를 가져옴
        const finalCryptoData = await Promise.all(
          cryptoList.map(async (crypto) => {
            try {
              // 개별 가상화폐의 상세 정보를 가져옴
              const details: CryptoItemData = await getIndividualCryptoData(
                crypto.coin
              );

              // 개별 가상화폐의 기간별 차트 데이터를 가져옴
              const weeklyChartData: CryptoChartData[] =
                await getWeeklyCryptoChartData(crypto.coin, 'day');
              const monthlyChartData: CryptoChartData[] =
                await getMonthlyCryptoChartData(crypto.coin, 'day');
              const yearlyChartData: CryptoChartData[] =
                await getYearlyCryptoChartData(crypto.coin, 'month');

              // 목록 데이터, 상세 정보, 주간 차트 데이터를 합쳐서 반환
              return {
                ...crypto,
                ...details,
                weeklyPrices: weeklyChartData.map((data) => data.coin_clpr), // 주간 종가를 추출하여 weeklyPrices에 저장
                monthlyPrices: monthlyChartData.map((data) => data.coin_clpr), // 월간 종가를 추출하여 monthlyPrices에 저장
                yearlyPrices: yearlyChartData.map((data) => data.coin_clpr), // 연간 종가를 추출하여 yearlyPrices에 저장
              };
            } catch (error) {
              console.error(
                '가상화폐 상세 정보 또는 차트 데이터를 가져오는 중 오류 발생:',
                error
              );
              return null;
            }
          })
        );

        // 오류로 인해 null인 데이터를 제외하고 상태에 설정
        const validCryptoData = finalCryptoData.filter(
          (item) => item !== null
        ) as CryptoItemData[];

        // 비트코인 가격 가져오기
        const bitcoinPrice = validCryptoData.find(
          (crypto) => crypto.coin === 'KRW-BTC'
        )?.price;

        // 비트코인캐시, 이더리움클래식 가격 재조정
        const adjustedCryptoData = validCryptoData.map((crypto) => {
          if (crypto.coin === 'BTC-BCH' && bitcoinPrice) {
            const adjustedPrice = crypto.price * bitcoinPrice;
            return { ...crypto, price: Number(adjustedPrice.toFixed(0)) };
          }
          if (crypto.coin === 'BTC-ETC' && bitcoinPrice) {
            const adjustedPrice = crypto.price * bitcoinPrice;
            return { ...crypto, price: Number(adjustedPrice.toFixed(0)) };
          }
          return crypto;
        });

        setCryptoData(adjustedCryptoData);
      } catch (error) {
        console.error('Error fetching crypto list:', error);
      }
    };

    fetchCryptoData();
  }, []);
  return cryptoData;
};
