import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { CryptoChartData } from '../../../investment/interfaces/CryptoInterface';

export const getWeeklyCryptoChartData = async (
  coinId: string,
  interval: string,
  count: number = 7
): Promise<CryptoChartData[]> => {
  try {
    const response = await axiosInstance.get<CryptoChartData[]>(
      `/api/coin/${coinId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 요청 오류', error.response?.data);
    } else {
      console.error('axios 오류 아님', error);
    }
    throw new Error('가상화폐 차트 정보 가져오는 중 오류 발생');
  }
};

export const getMonthlyCryptoChartData = async (
  coinId: string,
  interval: string,
  count: number = 30
): Promise<CryptoChartData[]> => {
  try {
    const response = await axiosInstance.get<CryptoChartData[]>(
      `/api/coin/${coinId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 요청 오류', error.response?.data);
    } else {
      console.error('axios 오류 아님', error);
    }
    throw new Error('가상화폐 차트 정보 가져오는 중 오류 발생');
  }
};

export const getYearlyCryptoChartData = async (
  coinId: string,
  interval: string,
  count: number = 12
): Promise<CryptoChartData[]> => {
  try {
    const response = await axiosInstance.get<CryptoChartData[]>(
      `/api/coin/${coinId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 요청 오류', error.response?.data);
    } else {
      console.error('axios 오류 아님', error);
    }
    throw new Error('가상화폐 차트 정보 가져오는 중 오류 발생');
  }
};
