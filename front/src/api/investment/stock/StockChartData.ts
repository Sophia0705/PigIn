import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { StockChartDataResponse } from '../../../investment/interfaces/StockInterface';

export const getStockChartData = async (
  stockId: string,
  interval: string,
  count: number = 10
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
