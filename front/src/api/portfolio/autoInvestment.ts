import axiosInstance from '../axiosInstance';

export const fetchAutoInvestment = async () => {
  try {
    const response = await axiosInstance.get('/api/auto-funding');
    console.log('자동투자GET res', response.data);
    return response.data;
  } catch (error) {
    console.error('자동투자GET 실패핑', error);
    throw error;
  }
};

export const saveAutoInvestment = async (settings: {
  isEnabled: boolean;
  investmentAmount: number;
  stocks: { stockCode: string; stockName: string; percent: number }[];
  coins: { coinCode: string; coinName: string; percent: number }[];
  golds: { gold: string; goldName: string; percent: number }[];
}) => {
  try {
    const response = await axiosInstance.post('/api/auto-funding', settings);
    return response.data;
  } catch (error) {
    console.error('자동 투자 설정 저장 중 오류핑:', error);
    throw error;
  }
};
