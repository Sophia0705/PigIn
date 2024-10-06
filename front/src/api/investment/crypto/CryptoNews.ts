import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { CryptoNews } from '../../../investment/interfaces/CryptoInterface';

export const getCryptoNews = async (): Promise<CryptoNews[]> => {
  try {
    const response = await axiosInstance.get<CryptoNews[]>('/news/getcoin');
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
