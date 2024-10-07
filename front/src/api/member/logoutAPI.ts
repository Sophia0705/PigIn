import axios from 'axios'; // axios 직접 사용
import axiosInstance from '../axiosInstance';
import { removeAccessToken } from '../../utils/localUtils';

// 로그아웃 API 호출 함수
export const logoutAPI = async (): Promise<boolean> => {
  try {
    // 로그아웃 요청 (POST 방식, application/json)
    const response = await axiosInstance.post('api/member/logout');

    console.log('response: ', response);

    // 응답 상태 코드 확인
    if (response.status === 200) {
      // 요청이 성공하면 액세스 토큰 제거
      removeAccessToken();

      console.log('로그아웃 성공!');
      return true;
    } else {
      // 응답 상태 코드가 200이 아닌 경우 처리
      console.error('로그아웃 실패, 상태 코드:', response.status);
      console.log('로그아웃에 실패했습니다.');
      return false;
    }
  } catch (error) {
    // 오류 처리
    if (axios.isAxiosError(error)) {
      console.error(
        '로그아웃 요청 실패:',
        error.response?.data || error.message
      );
      return false;
    } else {
      console.error('로그아웃 요청 실패:', error);
      return false;
    }
  }
};
