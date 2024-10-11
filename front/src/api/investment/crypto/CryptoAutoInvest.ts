import axiosInstance from '../../axiosInstance';
import { CryptoFavorite } from '../../../investment/interfaces/CryptoInterface';

export const checkIfAutoInvest = async (
  coinCode: string
): Promise<CryptoFavorite> => {
  try {
    const repsonse = await axiosInstance.get<CryptoFavorite>(
      `api/coin/${coinCode}/auto-funding`
    );
    return repsonse.data;
  } catch (error) {
    console.error('가상화폐 자동투자 목록 여부 조회 실패핑:', error);
    throw error;
  }
};

export const addToAutoInvest = async (coinCode: string): Promise<void> => {
  try {
    const response = await axiosInstance.post(
      `api/coin/${coinCode}/auto-funding`
    );
    console.log('가상화폐 자동투자 목록 추가 성공핑:', response.data);
  } catch (error) {
    console.error('가상화폐 자동투자 목록 추가 실패핑:', error);
    throw error;
  }
};

export const removeFromAutoInvest = async (coinCode: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(
      `api/coin/${coinCode}/auto-funding`
    );
    console.log('가상화폐 자동투자 목록 제거 성공핑:', response.data);
  } catch (error) {
    console.error('가상화폐 자동투자 목록 제거 실패핑:', error);
    throw error;
  }
};
