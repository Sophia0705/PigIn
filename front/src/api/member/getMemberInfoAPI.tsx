import axiosInstance from '../axiosInstance'; // axiosInstance 가져오기
import axios from 'axios';

// 회원 정보 응답 인터페이스 형식 정의
interface Data {
  email: string;
  name: string;
  phoneNumber: string;
  birth: string;
  savingRate: number;
}

// 회원 정보를 불러오는 API 함수
export const getMemberInfo = async (): Promise<Data> => {
  try {
    const response = await axiosInstance.get('member/userInfo'); // 회원 정보 GET 요청
    console.log(response);
    return response.data; // 현재 response가 status, data 등을 가져야하는데 data 자체로 나와서 오류남.
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('에러 정보(axios 오류): ', error.response?.data);
    } else {
      console.error('에러 정보: ', error);
    }
    throw new Error('회원 정보를 불러오는데에 실패하였습니다.');
  }
};
