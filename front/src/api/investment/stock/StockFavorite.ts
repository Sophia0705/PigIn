import axiosInstance from '../../axiosInstance';
import { StockFavorite } from '../../../investment/interfaces/StockInterface';

export const checkIfFavorite = async (
  stockId: string
): Promise<StockFavorite> => {
  try {
    const repsonse = await axiosInstance.get<StockFavorite>(
      `api/stock/${stockId}/favorite`
    );
    return repsonse.data;
  } catch (error) {
    console.error('주식 찜 여부 조회 실패핑:', error);
    throw error;
  }
};

export const addToFavorite = async (stockId: string): Promise<void> => {
  try {
    const response = await axiosInstance.post(`api/stock/${stockId}/favorite`);
    console.log('주식 찜 목록에 추가 성공:', response.data);
  } catch (error) {
    console.error('주식 찜 목록에 추가 실패:', error);
    throw error;
  }
};

export const removeFromFavorite = async (stockId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(
      `api/stock/${stockId}/favorite`
    );
    console.log('주식 찜 목록에서 삭제 성공:', response.data);
  } catch (error) {
    console.error('주식 찜 목록에서 삭제 실패:', error);
    throw error;
  }
};
