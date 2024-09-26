import axios from 'axios';
import axiosInstance from './axiosInstance';

// 응답 인터페이스 형식 정의 - 무슨무슨 데이터 들어가는지
interface HealthCheckResponse {
  message: string;
}

export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    // axiosInstance 사용해 api 호출
    const response =
      await axiosInstance.get<HealthCheckResponse>('api/health-check');
    // 응답 데이터 반환(성공했을 때)
    return response.data;

    // 오류 췤
  } catch (error: unknown) {
    // axios의 오류라면 그렇다고 명시
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
      // 아니라면 아니라고 명시
    } else {
      console.error('axios 잘못 아님 너잘못임:', error);
    }
    // 틀렸으니깐 다시 해라
    throw new Error('다시 해라');
  }
};
