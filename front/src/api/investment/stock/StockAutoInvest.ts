import axiosInstance from '../../axiosInstance';
import { StockFavorite } from '../../../investment/interfaces/StockInterface';

export const checkIfAutoInvest = async (
  stockId: string
): Promise<StockFavorite> => {
  try {
    const response = await axiosInstance.get<StockFavorite>(
      `api/stock/${stockId}/auto-funding`
    );
    return response.data;
  } catch (error) {
    console.error('주식 자동투자 목록 여부 조회 실패핑:', error);
    throw error;
  }
};

export const addToAutoInvest = async (stockId: string): Promise<void> => {
  try {
    const response = await axiosInstance.post(
      `api/stock/${stockId}/auto-funding`
    );
    console.log('주식 자동투자 목록 추가 성공핑:', response.data);
  } catch (error) {
    console.error('주식 자동투자 목록 추가 실패핑:', error);
    throw error;
  }
};

export const removeFromAutoInvest = async (stockId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(
      `api/stock/${stockId}/auto-funding`
    );
    console.log('주식 자동투자 목록 제거 성공핑:', response.data);
  } catch (error) {
    console.error('주식 자동투자 목록 제거 실패핑:', error);
    throw error;
  }
};
