import axiosInstance from '../axiosInstance';

// 투자 계좌 정보 인터페이스
interface InvestmentAccountInfo {
  accountNo: string;
  balance: number;
}

// 소비 계좌 정보 인터페이스
interface SpendingAccountInfo {
  accountNo: string;
  balance: number;
  bank: string;
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

// 소비 계좌 정보 불러오는 함수
export const fetchSpendingAccountInfo =
  async (): Promise<SpendingAccountInfo> => {
    try {
      const response = await axiosInstance.get('api/member/member-balance');
      console.log(response);
      if (response.status === 200) {
        const { accountNo, money, bank } = response.data;
        console.log('소비 계좌 정보 : ', { accountNo, balance: money, bank });

        return {
          accountNo: accountNo,
          balance: money,
          bank: bank,
        };
      } else {
        console.error(
          'Failed to fetch spending account information: Status not 200'
        );
        throw new Error('Failed to fetch spending account information');
      }
    } catch (error) {
      console.error('Failed to fetch spending account information:', error);
      throw error;
    }
  };

// 계좌 1원 송금 기능
export const authenticateInvestmentAccount = async (
  accountNo: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      'api/member/account-authentication',
      {
        accountNo: accountNo,
      }
    );
    console.log('1원 송금 요청 response : ', response);
    return response.status === 200; // 성공 시 true 반환
  } catch (error) {
    console.error('Failed to authenticate investment account:', error);
    return false; // 실패 시 false 반환
  }
};

// 송금 인증 확인 기능
export const verifyTransferAuthentication = async (
  accountNo: string,
  authCode: string
): Promise<boolean> => {
  const submittedData = {
    accountNo: accountNo,
    authCode: authCode,
  };
  console.log('제출 데이터 : ', submittedData);
  try {
    const response = await axiosInstance.post(
      'api/member/account-authentication-compare',
      submittedData
    );
    console.log('1원 송금 인증 확인 response : ', response);
    return response.status === 200; // 성공 시 true 반환
  } catch (error) {
    console.error('Failed to verify transfer authentication:', error);
    return false; // 실패 시 false 반환
  }
};

// 소비 계좌 등록 함수
export const registerSpendingAccount = async (
  bank: string,
  accountNo: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post('api/member/account', {
      bank: bank,
      accountNo: accountNo,
    });

    console.log('소비 계좌 등록 response:', response);

    // status가 200이면 성공으로 true 반환
    return response.status === 200;
  } catch (error) {
    console.error('Failed to register spending account:', error);
    return false; // 실패 시 false 반환
  }
};
