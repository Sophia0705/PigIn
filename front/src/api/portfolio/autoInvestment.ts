import axiosInstance from '../axiosInstance';

// 투자 계좌 정보 인터페이스
interface InvestmentAccountInfo {
  accountNo: string;
  balance: number;
}

// 투자 계좌 정보 불러오는 함수
export const fetchInvestmentAccountInfo =
  async (): Promise<InvestmentAccountInfo> => {
    try {
      const response = await axiosInstance.get('api/member/saving-balance');
      console.log('투자 계좌 응답 전체:', response);
      if (response.status === 200) {
        const { accountNo, money } = response.data;
        console.log('투자 계좌 정보 : ', { accountNo, balance: money });
        return {
          accountNo: accountNo,
          balance: money,
        };
      } else {
        console.error(
          'Failed to fetch investment account information: Status not 200'
        );
        throw new Error('Failed to fetch investment account information');
      }
    } catch (error) {
      console.error('Failed to fetch investment account information:', error);
      throw error;
    }
  };

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
