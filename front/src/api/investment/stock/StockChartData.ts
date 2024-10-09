import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import {
  StockChartDataResponse,
  StockLiveData,
} from '../../../investment/interfaces/StockInterface';

export const getWeeklyStockChartData = async (
  stockId: string,
  interval: string,
  count: number = 7
): Promise<StockChartDataResponse[]> => {
  try {
    const response = await axiosInstance.get<StockChartDataResponse[]>(
      `api/stock/${stockId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};

export const getMonthlyStockChartData = async (
  stockId: string,
  interval: string,
  count: number = 30
): Promise<StockChartDataResponse[]> => {
  try {
    const response = await axiosInstance.get<StockChartDataResponse[]>(
      `api/stock/${stockId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};

export const getYearlyStockChartData = async (
  stockId: string,
  interval: string,
  count: number = 12
): Promise<StockChartDataResponse[]> => {
  try {
    const response = await axiosInstance.get<StockChartDataResponse[]>(
      `api/stock/${stockId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};

export const getLiveStockChartData = async (
  stockId: string,
  interval: string,
  count: number = 20
): Promise<StockLiveData[]> => {
  try {
    const response = await axiosInstance.get<StockLiveData[]>(
      `api/stock/${stockId}/chart/${interval}`,
      { params: { count } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};

export const getUpdatedLiveStockData = async (
  stockId: string
): Promise<{ data: StockLiveData; live: boolean }> => {
  try {
    const response = await axiosInstance.get<{
      data: StockLiveData;
      live: boolean;
    }>(`api/stock/${stockId}/live`);
    return response.data;
  } catch (error) {
    console.error('최신 1분봉 주식 데이터 가져오기 실패핑:', error);
    throw error;
  }
};

export const getKospiChartData = async (
  count: 20
): Promise<StockLiveData[]> => {
  try {
    const response = await axiosInstance.get<StockLiveData[]>(
      `/api/stock/0001/chart/day`,
      { params: { count } }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};
