import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface PurchaseStockResponse {
  buyPrice: string;
  stockPrice: string;
}

export const purchaseStock = async (
  stockId: string,
  buyPrice: number,
  stockPrice: number
): Promise<PurchaseStockResponse> => {
  try {
    const response = await axiosInstance.post<PurchaseStockResponse>(
      `api/stock/${stockId}/buy`,
      {
        buyPrice: buyPrice.toString(),
        stockPrice: stockPrice.toString(),
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios 문제임:', error.response?.data);
    } else {
      console.error('니 문제임:', error);
    }
    throw new Error('주식 구매 실패');
  }
};
