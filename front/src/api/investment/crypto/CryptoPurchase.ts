import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface PurchaseCryptoResponse {
  coinCode: string;
  price: string;
}

export const purchaseCrypto = async (
  cryptoId: string,
  buyPrice: number
): Promise<PurchaseCryptoResponse> => {
  try {
    const response = await axiosInstance.post<PurchaseCryptoResponse>(
      `api/coin/${cryptoId}/buy`,
      {
        coinCode: cryptoId,
        price: buyPrice.toString(),
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 문제로 가상화폐 매수 실패핑:', error.response?.data);
    } else {
      console.error('니 문제로 가상화폐 매수 실패핑:', error);
    }
    throw new Error('가상화폐 구매 실패핑');
  }
};
