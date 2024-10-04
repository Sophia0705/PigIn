import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface PurchaseStockResponse {
  stockCode: string;
  price: string;
}

export const purchaseStock = async (
  stockId: string,
  buyPrice: number
): Promise<PurchaseStockResponse> => {
  try {
    const response = await axiosInstance.post<PurchaseStockResponse>(
      `api/stock/${stockId}/buy`,
      {
        stockCode: stockId,
        price: buyPrice.toString(),
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 문제로 주식 매수 실패핑:', error.response?.data);
    } else {
      console.error('니 문제로 주식 매수 실패핑:', error);
    }
    throw new Error('주식 구매 실패핑');
  }
};
