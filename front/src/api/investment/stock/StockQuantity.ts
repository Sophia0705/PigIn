import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface StockQuantityResponse {
  stockCode: string;
  name: string;
  amount: number;
  price: number;
  profitRate: number;
}

export const getStockQuantity = async (
  stockId: string
): Promise<StockQuantityResponse> => {
  try {
    const response = await axiosInstance.get<StockQuantityResponse>(
      `api/stock/${stockId}/quantity`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'axios 문제로 주식 상세정보 가져오기 실패핑:',
        error.response?.data
      );
    } else {
      console.error('니 문제로 주식 상세정보 가져오기 실패핑:', error);
    }
    throw new Error('주식 상세정보 가져오기 실패핑');
  }
};
