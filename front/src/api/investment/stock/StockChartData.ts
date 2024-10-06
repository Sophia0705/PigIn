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

export const getLiveStockChartData = async (): Promise<StockLiveData[]> => {
  try {
    const response = await axiosInstance.get<StockLiveData[]>('api/stock/live');
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
