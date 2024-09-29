import axios, { AxiosResponse } from 'axios'; // AxiosResponse 타입 가져오기
import axiosInstance from '../axiosInstance';

// 인증번호 비교 요청 데이터 타입 정의
interface CompareVerificationRequest {
  phoneNumber: string;
  authenticationNumber: string;
}

// 인증번호 비교 API 함수
export const compareVerificationCode = async (
  data: CompareVerificationRequest
): Promise<AxiosResponse> => {
  try {
    // POST 요청으로 인증번호 비교
    const response = await axiosInstance.post<void>(
      'member/mms-number-compare',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);

    // 응답 상태가 200일 경우 성공적으로 인증됨
    if (response.status === 200) {
      console.log('인증 성공:', response);
      return response; // 응답 전체 반환
    }
    throw new Error('인증 실패');
  } catch (error: unknown) {
    // error가 AxiosError 타입인지 확인
    if (axios.isAxiosError(error)) {
      // 상태 코드에 따른 오류 처리
      if (error.response?.status === 400) {
        console.error('인증번호가 만료되었습니다.');
        alert('인증번호가 만료되었습니다.');
      } else if (error.response?.status === 409) {
        console.error('인증번호가 틀렸습니다.');
        alert('인증번호가 틀렸습니다.');
      } else {
        console.error('인증 요청 실패:', error);
      }
    } else {
      console.error('알 수 없는 오류:', error);
    }
    throw new Error('인증 실패');
  }
};
