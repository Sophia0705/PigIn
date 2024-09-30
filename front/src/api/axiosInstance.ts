import axios from 'axios';
import { getAccessToken } from '../utils/localUtils';

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response 인터셉터는 제거, 다른 용도로 사용 --> 일반적인 에러 찾는 용도
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 여기서는 인증 관련 처리X --> authGuard 에서 쓰는걸로!
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
