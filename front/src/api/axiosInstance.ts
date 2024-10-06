import axios from 'axios';
import { reissueAccessTokenAPI } from './member/reissueAccessTokenAPI';
import { setAccessToken, getAccessToken } from '../utils/localUtils';

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 관련 설정
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 로그인 요청 시 Content-Type을 multipart/form-data로 변경
    if (config.url === 'api/member/login') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    // 회원가입, 로그인, 로그아웃 요청인 경우 토큰을 포함하지 않음
    if (
      config.url === 'api/member/sign-up' ||
      config.url === 'api/member/login' ||
      config.url === 'api/member/logout'
    ) {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.access = `${token}`;
    }
    console.log(config.headers.access);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 401 오류 시 토큰 재발급을 시도하고, 실패 시 로그아웃 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 발생하고, 토큰 만료 메시지가 있을 때만 재발급 시도
    if (
      error.response?.status === 401 &&
      error.response?.data === 'access token expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지
      console.log(
        'AXIOSINSTANCE error.response.status : ',
        error.response.status
      );
      console.log('AXIOSINSTANCE error.response.data : ', error.response.data);
      try {
        console.log('AXIOSINSTANCE Access token expired, trying to reissue...');
        const newAccessToken = await reissueAccessTokenAPI(); // 토큰 재발급 API 호출
        console.log('AXIOSINSTANCE New access token received:', newAccessToken);

        setAccessToken(newAccessToken); // 새로운 토큰 저장
        originalRequest.headers.access = `${newAccessToken}`; // 원래 요청에 새로운 토큰 추가
        return axiosInstance(originalRequest); // 원래 요청 재시도
      } catch (reissueError) {
        console.error('AXIOSINSTANCE 토큰 재발급 실패:', reissueError);
        // removeAccessToken(); // 실패 시 토큰 삭제
        return Promise.reject(reissueError);
      }
    }

    console.error('AXIOSINSTANCE API 요청 오류:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
