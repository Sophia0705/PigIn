import axios from 'axios';
import { setAccessToken } from '../../utils/localUtils';

// reissue API 호출 함수
export const reissueAccessTokenAPI = async (): Promise<string> => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    // axiosInstance 대신 기본 axios를 사용하여 인터셉터를 우회함
    const response = await axios.post(
      `${baseURL}api/member/reissue`,
      {},
      {
        withCredentials: true, // 쿠키에 저장된 리프레시 토큰을 전송
      }
    );

    console.log('재발급API Reissue API 응답:', response);

    if (response.status === 200) {
      const accessToken = response.headers['access'];
      if (!accessToken) {
        throw new Error('재발급API Access Token이 응답에 없습니다.');
      }

      setAccessToken(accessToken); // 새로 발급받은 액세스 토큰 저장
      return accessToken;
    } else {
      console.error(
        '재발급API 토큰 재발급 실패, 상태 코드:',
        response.status,
        '재발급API 응답 데이터:',
        response.data
      );
      throw new Error('재발급API 토큰 재발급 실패');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '재발급API 토큰 재발급 요청 실패, 응답 데이터:',
        error.response?.data
      );
    } else {
      console.error('재발급API 오류 발생:', error);
    }
    throw new Error('재발급API 토큰 재발급에 실패했습니다.');
  }
};
