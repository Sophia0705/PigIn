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
export const getMemberInfoAPI = async (): Promise<Data> => {
  try {
    const response = await axiosInstance.get<Data>('api/member/userInfo'); // 회원 정보 GET 요청
    return response.data; // 소문자 response의 data를 반환
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('에러 정보(axios 오류): ', error.response?.data);
    } else {
      console.error('에러 정보: ', error);
    }
    throw new Error('회원 정보를 불러오는데에 실패하였습니다.');
  }
};
