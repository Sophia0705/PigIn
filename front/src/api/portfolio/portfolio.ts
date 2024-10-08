import axiosInstance from '../axiosInstance';
import { PortfolioState } from '../../portfolio/interfaces/PortfolioInterface';

export const fetchPortfolioData = async (): Promise<PortfolioState> => {
  try {
    const response = await axiosInstance.get<PortfolioState>('/api/portfolio');
    console.log('포트폴리오 res', response.data);
    return response.data;
  } catch (error) {
    console.error('포트폴리오 가져오기 실패핑:', error);
    throw new Error('Failed to fetch portfolio data');
  }
};
