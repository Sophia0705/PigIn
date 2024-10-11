import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { GoldChartDataResponse } from '../../../investment/interfaces/GoldInterface';

export const getWeeklyGoldChartData = async (): Promise<
  GoldChartDataResponse[]
> => {
  try {
    const response =
      await axiosInstance.get<GoldChartDataResponse[]>('api/gold/gold-week');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('주간 금 차트 데이터 가져오는 데 실패');
  }
};

export const getMonthlyGoldChartData = async (): Promise<
  GoldChartDataResponse[]
> => {
  try {
    const response = await axiosInstance.get<GoldChartDataResponse[]>(
      'api/gold/gold-month'
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('월간 금 차트 데이터 가져오는 데 실패');
  }
};

export const getThreeMonthlyGoldChartData = async (): Promise<
  GoldChartDataResponse[]
> => {
  try {
    const response = await axiosInstance.get<GoldChartDataResponse[]>(
      'api/gold/gold-three-month'
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('3개월 금 차트 데이터 가져오는 데 실패');
  }
};

export const getYearlyGoldChartData = async (): Promise<
  GoldChartDataResponse[]
> => {
  try {
    const response =
      await axiosInstance.get<GoldChartDataResponse[]>('api/gold/gold-year');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('연간 금 차트 데이터 가져오는 데 실패');
  }
};
