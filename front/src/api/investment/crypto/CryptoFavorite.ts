import axiosInstance from '../../axiosInstance';
import { CryptoFavorite } from '../../../investment/interfaces/CryptoInterface';

export const checkIfFavorite = async (
  coinCode: string
): Promise<CryptoFavorite> => {
  try {
    const repsonse = await axiosInstance.get<CryptoFavorite>(
      `api/coin/${coinCode}/favorite`
    );
    return repsonse.data;
  } catch (error) {
    console.error('가상화폐 찜 여부 조회 실패핑:', error);
    throw error;
  }
};

export const addToFavorite = async (coinCode: string): Promise<void> => {
  try {
    const response = await axiosInstance.post(`api/coin/${coinCode}/favorite`);
    console.log('가상화폐 찜 목록에 추가 성공:', response.data);
  } catch (error) {
    console.error('가상화폐 찜 목록에 추가 실패:', error);
    throw error;
  }
};

export const removeFromFavorite = async (coinCode: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(
      `api/coin/${coinCode}/favorite`
    );
    console.log('가상화폐 찜 목록에서 삭제 성공:', response.data);
  } catch (error) {
    console.error('가상화폐 찜 목록에서 삭제 실패:', error);
    throw error;
  }
};
