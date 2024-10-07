import axiosInstance from '../axiosInstance';

export const fetchAccountBalance = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get('/api/member/balance');
    return response.data; // 숫자 잔액만 반환
  } catch (error) {
    console.error('Failed to fetch account balance:', error);
    throw error;
  }
};
