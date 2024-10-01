import axiosInstance from '../axiosInstance'; // axiosInstance 가져오기
import axios from 'axios'; // AxiosError 타입을 가져오기

// 비밀번호 재설정 요청 데이터 타입 정의
interface ResetPasswordRequest {
  email: string;
  password: string;
}

// 비밀번호 재설정 API 함수
export const resetPasswordAPI = async (
  data: ResetPasswordRequest
): Promise<boolean> => {
  try {
    console.log('비밀번호 재설정 요청 데이터: ', data);

    // PUT 요청으로 비밀번호 재설정 (AxiosResponse로 응답 받기)
    const response = await axiosInstance.put('api/member/refresh-pwd', data);

    // 응답이 성공적일 경우
    if (response.status === 200) {
      console.log('비밀번호 재설정 완료!');
      return true; // 성공 시 true 반환
    }
    return false; // 성공하지 못한 경우 false 반환
  } catch (error: unknown) {
    // 상태 코드에 따른 오류 처리
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        alert('해당 회원을 찾지 못했습니다.');
      } else {
        console.error('비밀번호 재설정 실패:', error.response?.data);
        alert('비밀번호 재설정에 실패하였습니다.');
      }
    } else {
      console.error('알 수 없는 오류', error);
    }
    return false;
  }
};
