import axiosInstance from '../../axiosInstance';

export const checkIfFavorite = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get<boolean>('/api/gold/isfavorite');
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 여부 확인 오류:', error);
    throw error;
  }
};

export const addGoldToFavorite = async (): Promise<void> => {
  try {
    await axiosInstance.get('/api/gold/favorite');
    console.log('금 즐겨찾기에 추가 성공핑');
  } catch (error) {
    console.error('금 즐겨찾기 추가 오류핑:', error);
    throw error;
  }
};

export const removeGoldFromFavorite = async (): Promise<void> => {
  try {
    await axiosInstance.get('/api/gold/favorite-cancel');
    console.log('금 즐겨찾기에서 삭제 성공핑');
  } catch (error) {
    console.error('금 즐겨찾기 삭제 오류핑:', error);
    throw error;
  }
};
