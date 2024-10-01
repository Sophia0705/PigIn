import axiosInstance from '../axiosInstance'; // axiosInstance 가져오기
import axios from 'axios'; // AxiosError 타입을 가져오기

// RequestData 인터페이스 정의
interface RequestData {
  name: string;
  phoneNumber: string;
  email: string;
}

// 비밀번호 찾기 및 핸드폰 인증번호 요청 API 함수
export const findPasswordAndSendVerificationCodeAPI = async (
  requestData: RequestData
): Promise<boolean> => {
  try {
    // 비밀번호 찾기 API 호출
    const response = await axiosInstance.post(
      'api/member/find-pwd',
      requestData
    );
    console.log(requestData);

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error: unknown) {
    // 상태 코드에 따른 오류 처리
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        alert('해당 사용자를 찾을 수 없습니다.');
      } else if (error.response?.status === 408) {
        alert('메시지 전송에 실패했습니다.');
      } else {
        console.error('비밀번호 찾기 요청 실패:', error.response?.data);
        alert('비밀번호 찾기에 실패하였습니다.');
      }
    } else {
      console.error('알 수 없는 오류', error);
    }
    return false;
  }
};
