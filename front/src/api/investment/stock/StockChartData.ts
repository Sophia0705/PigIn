import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface StockChartDataResponse {
  stck_bsop_date: string; // 날짜
  stck_clpr: string; // 종가
  stck_oprc: string; // 시가
  stck_hgpr: string; // 최고가
  stck_lwpr: string; // 최저가
  acml_vol: string; // 거래량
}

export const getStockChartData = async (
  stockId: string,
  interval: string
): Promise<StockChartDataResponse[]> => {
  try {
    const response = await axiosInstance.get<StockChartDataResponse[]>(
      `api/stock/${stockId}/chart/${interval}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios의 오류임:', error.response?.data);
    } else {
      console.error('axios 오류 아님:', error);
    }
    throw new Error('다시 해라');
  }
};
