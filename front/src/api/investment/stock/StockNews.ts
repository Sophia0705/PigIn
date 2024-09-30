import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { StockNews } from '../../../investment/interfaces/StockInterface';

export const getStockNews = async (stockId: string): Promise<StockNews[]> => {
  try {
    const response = await axiosInstance.get<StockNews[]>(`news/${stockId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
      throw error;
    } else {
      console.error('axios의 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};
