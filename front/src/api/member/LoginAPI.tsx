import axiosInstance from '../axiosInstance';
import axios from 'axios';
import { setAccessToken } from '../../utils/localUtils'; // 유틸리티 함수 가져오기

// 로그인 요청에 필요한 데이터 타입 정의
interface LoginRequest {
  username: string; // 이메일(username)로 전달
  password: string;
}

// 로그인 응답에 대한 타입 정의 (accessToken만 사용)
interface LoginResponse {
  accessToken: string;
}

// 로그인 API 호출 함수
export const LoginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // 환경 변수에서 API 기본 URL 가져오기
    const baseURL = 'https://j11c203.p.ssafy.io/';
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('username', data.username); // username을 FormData에 추가
    formData.append('password', data.password); // password를 FormData에 추가
    console.log('LoginAPI : ', data.username, data.password);

    // 서버에 로그인 요청 (FormData 전송)
    const response = await axios.post(`${baseURL}api/member/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData 전송을 위한 Content-Type 설정
      },
      withCredentials: true, // 쿠키나 세션 정보를 전송하기 위한 설정
    });
    console.log('response : ', response);
    // 응답 헤더에서 모든 헤더 값 출력 (디버깅용)
    console.log('응답 헤더:', response.headers);

    // 응답 헤더에서 accessToken 추출
    const accessToken = response.headers['access']; // 헤더에서 'access' 추출
    console.log('access: ', accessToken);
    // 액세스 토큰을 로컬 스토리지에 저장
    setAccessToken(accessToken);

    if (!accessToken) {
      throw new Error('Access Token이 응답에 없습니다.');
    }

    // 추출한 accessToken을 반환
    console.log('액세스 토큰 발행 성공!');
    return { accessToken };
  } catch (error) {
    // 오류 발생 시 처리
    if (axios.isAxiosError(error)) {
      console.error('로그인 요청 실패:', error.response?.data);
    } else {
      console.error('오류 발생:', error);
    }
    throw new Error('로그인에 실패했습니다.');
  }
};
