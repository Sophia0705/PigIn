import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { CryptoListData } from '../../../investment/interfaces/CryptoInterface';

export const getCryptoList = async (): Promise<CryptoListData[]> => {
  try {
    const response = await axiosInstance.get<CryptoListData[]>('/api/coin');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('가상화폐 목록 가져오기 실패');
  }
};
