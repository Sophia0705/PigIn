import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { StockListResponse } from 'investment/interfaces/StockInterface';

export const searchStocks = async (
  searchQuery: string
): Promise<StockListResponse[]> => {
  try {
    const response = await axiosInstance.get<StockListResponse[]>(
      'api/stock/search',
      {
        params: {
          keyword: searchQuery,
        },
      }
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
