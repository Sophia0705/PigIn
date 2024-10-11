import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { CryptoListData } from '../../../investment/interfaces/CryptoInterface';

export const searchCryptos = async (
  searchQuery: string
): Promise<CryptoListData[]> => {
  try {
    const response = await axiosInstance.get<CryptoListData[]>(
      'api/coin/search',
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
