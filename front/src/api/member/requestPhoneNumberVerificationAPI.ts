import { AxiosResponse } from 'axios';
import axiosInstance from '../axiosInstance';

// SMS 인증 요청 데이터 타입 정의
interface VerificationRequest {
  name: string;
  phoneNumber: string; // 하이픈 제거된 전화번호
}

// 휴대폰 번호 인증 API 함수
export const requestPhoneNumberVerificationAPI = async (
  data: VerificationRequest
): Promise<boolean> => {
  try {
    console.log('data : ', data);

    // POST 요청으로 전화번호 전송하여 인증번호 요청
    const response = await axiosInstance.post<AxiosResponse>(
      'member/mms-number-generate',
      data
    );

    // 응답이 성공적일 경우
    if (response.status === 200) {
      console.log('SMS 인증 요청 성공:', response);
      return true; // 성공적으로 요청이 완료된 경우 true 반환
    } else {
      console.log('SMS 인증 요청 실패: 상태 코드', response.status);
      return false; // 성공하지 않은 경우 false 반환
    }
  } catch (error) {
    console.error('SMS 인증 요청 실패:', error);
    return false; // 오류가 발생한 경우 false 반환
  }
};
