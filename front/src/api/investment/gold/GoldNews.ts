import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { GoldNews } from '../../../investment/interfaces/GoldInterface';

export const getGoldNews = async (): Promise<GoldNews[]> => {
  try {
    const response = await axiosInstance.get<GoldNews[]>('/news/getgold');
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
