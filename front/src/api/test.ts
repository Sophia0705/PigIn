import axios from 'axios';
import axiosInstance from './axiosInstance';

interface HealthCheckResponse {
  message: string;
}

export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response =
      await axiosInstance.get<HealthCheckResponse>('api/health-check');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error during health-check:', error.response?.data);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw new Error('Health check failed.');
  }
};
