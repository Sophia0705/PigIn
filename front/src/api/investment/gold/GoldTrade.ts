import axiosInstance from '../../axiosInstance';

interface GoldTradeRequest {
  tradePrice: number; // 거래 금액
  method: 'BUY' | 'SELL'; // 구매 또는 판매
}

export const tradeGold = async (tradePrice: number, method: 'BUY' | 'SELL') => {
  try {
    const response = await axiosInstance.post('/api/gold/trade', {
      tradePrice,
      method,
    } as GoldTradeRequest);

    return response.data;
  } catch (error) {
    console.error(`금 ${method === 'BUY' ? '매수' : '매도'} 오류 발생:`, error);
    throw error;
  }
};

export const getMyGold = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get('/api/gold/mine');
    return response.data;
  } catch (error) {
    console.error('내 금 잔액 오류핑:', error);
    throw error;
  }
};
