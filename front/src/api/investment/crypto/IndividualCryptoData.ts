import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { CryptoItemData } from '../../../investment/interfaces/CryptoInterface';

export const getIndividualCryptoData = async (
  coinId: string
): Promise<CryptoItemData> => {
  try {
    const response = await axiosInstance.get<CryptoItemData>(
      `api/coin/${coinId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('상세 가상화폐 정보 가져오기 실패');
  }
};
