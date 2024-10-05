import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface SellCryptoResponse {
  coinCode: string;
  price: string;
}

export const sellCrypto = async (
  cryptoId: string,
  sellPrice: number
): Promise<SellCryptoResponse> => {
  try {
    const response = await axiosInstance.post<SellCryptoResponse>(
      `api/coin/${cryptoId}/sell`,
      {
        coinCode: cryptoId,
        price: sellPrice.toString(),
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 문제로 가상화폐 매도 실패핑:', error.response?.data);
    } else {
      console.error('니 문제로 가상화폐 매도 실패핑:', error);
    }
    throw new Error('가상화폐 매도 실패핑');
  }
};
