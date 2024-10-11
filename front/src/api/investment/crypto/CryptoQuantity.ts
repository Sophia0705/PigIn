import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface CryptoQuantityResponse {
  coinCode: string;
  name: string;
  amount: number;
  price: number;
  profitRate: number;
}

export const getCryptoQuantity = async (
  cryptoId: string
): Promise<CryptoQuantityResponse> => {
  try {
    const response = await axiosInstance.get<CryptoQuantityResponse>(
      `api/coin/${cryptoId}/quantity`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'axios 문제로 가상화폐 상세정보 가져오기 실패핑:',
        error.response?.data
      );
    } else {
      console.error('니 문제로 가상화폐 상세정보 가져오기 실패핑:', error);
    }
    throw new Error('가상화폐 상세정보 가져오기 실패핑');
  }
};
