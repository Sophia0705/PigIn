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
    // 회원가입 요청인 경우 토큰을 포함하지 않음
    if (config.url === '/member/sign-up') {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
