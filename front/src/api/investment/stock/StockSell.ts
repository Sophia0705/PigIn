import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface SellStockRequest {
  stockCode: string;
  amount: string;
}

interface SellStockResponse {
  stockCode: string;
  amount: string;
}

export const sellStock = async (
  stockId: string,
  amount: number
): Promise<SellStockResponse> => {
  try {
    const response = await axiosInstance.post<SellStockResponse>(
      `api/stock/${stockId}/sell`,
      {
        stockCode: stockId,
        amount: amount.toFixed(3),
      } as SellStockRequest
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 문제로 주식 매도 실패핑:', error.response?.data);
    } else {
      console.error('니 문제로 주식 매도 실패핑:', error);
    }
    throw new Error('주식 매도 실패핑');
  }
};
