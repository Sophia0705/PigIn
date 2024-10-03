import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { GoldItemData } from '../../../investment/interfaces/GoldInterface';

const getGoldData = async (): Promise<GoldItemData> => {
  try {
    const response = await axiosInstance.get<GoldItemData>('api/gold/detail');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('금 상세정보 가져오는 중 에러 발생:', error.response?.data);
    } else {
      console.error('금 상세정보 가져오는 중 에러 발생:', error);
    }
    throw error;
  }
};

export default getGoldData;
