// import axiosInstance from '../axiosInstance';
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { setAccessToken } from '../../utils/localUtils'; // 유틸리티 함수 가져오기

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('username', data.username); // username을 FormData에 추가
    formData.append('password', data.password); // password를 FormData에 추가
    console.log('LoginAPI data : ', data);

    // 서버에 로그인 요청 (FormData 전송)
    const response = await axiosInstance.post('api/member/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData 전송을 위한 Content-Type 설정
      },
      withCredentials: true, // 쿠키나 세션 정보를 전송하기 위한 설정
    });

    console.log('response : ', response);
    console.log('응답 헤더:', response.headers);

    if (response.status === 200) {
      const accessToken = response.headers['access'];
      console.log('access: ', accessToken);

      if (!accessToken) {
        throw new Error('Access Token이 응답에 없습니다.');
      }

      setAccessToken(accessToken);

      console.log('액세스 토큰 발행 성공!');
      console.log('로그인 성공!');
      return { accessToken };
    } else {
      console.error(
        '로그인 실패, 상태 코드:',
        response.status,
        '응답 데이터:',
        response.data
      );
      throw new Error(`로그인 실패, 상태 코드: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('로그인 요청 실패:', error.response?.data);
    } else {
      console.error('오류 발생:', error);
    }
    throw new Error('로그인에 실패했습니다.');
  }
};
