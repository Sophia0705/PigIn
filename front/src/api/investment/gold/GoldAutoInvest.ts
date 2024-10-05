import axiosInstance from '../../axiosInstance';

export const addGoldToAutoInvestment = async () => {
  try {
    const response = await axiosInstance.get('/api/gold/auto-funding-add');
    return response.data;
  } catch (error) {
    console.error('금 자동투자 추가 오류 발생:', error);
    throw error;
  }
};

export const cancelGoldFromAutoInvestment = async () => {
  try {
    const response = await axiosInstance.get('/api/gold/auto-funding-cancel');
    return response.data;
  } catch (error) {
    console.error('금 자동투자 제거 오류 발생:', error);
    throw error;
  }
};

export const isGoldInAutoInvestment = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/api/gold/is-auto-funding');
    return response.data;
  } catch (error) {
    console.error('금 자동투자 상태 조회 오류 발생:', error);
    throw error;
  }
};
