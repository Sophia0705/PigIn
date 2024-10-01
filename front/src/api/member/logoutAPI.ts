import axios from 'axios'; // axios 직접 사용
import { removeAccessToken } from '../../utils/localUtils';

// 로그아웃 API 호출 함수
export const logoutAPI = async (): Promise<void> => {
  try {
    // 환경 변수에서 API 기본 URL 가져오기
    const baseURL = import.meta.env.VITE_BASE_URL; 
    // 로그아웃 요청 (POST 방식, application/json)
    const response = await axios.post(
      `${baseURL}member/logout`,
      {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 설정
        },
      }
    );

    console.log('response: ', response);

    // 응답 상태 코드 확인
    if (response.status === 200) {
      // 요청이 성공하면 액세스 토큰 제거
      removeAccessToken();

      alert('로그아웃 성공!');
      // 랜딩 페이지로 이동
      window.location.href = '/';
    } else {
      // 응답 상태 코드가 200이 아닌 경우 처리
      console.error('로그아웃 실패, 상태 코드:', response.status);
      alert('로그아웃에 실패했습니다.');
    }
  } catch (error) {
    // 오류 처리
    if (axios.isAxiosError(error)) {
      console.error(
        '로그아웃 요청 실패:',
        error.response?.data || error.message
      );
    } else {
      console.error('로그아웃 요청 실패:', error);
    }
    alert('로그아웃에 실패했습니다.');
  }
};
