import axios from 'axios';
import { getAccessToken } from '../utils/localUtils';

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
