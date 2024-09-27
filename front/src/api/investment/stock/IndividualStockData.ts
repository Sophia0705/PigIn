import axios from 'axios';
import axiosInstance from '../../axiosInstance';

interface IndividualStockDataResponse {
  prdy_vrss: string; // 전일 대비 가격 변동
  prdy_vrss_sign: string; // 전일 대비 가격 상승(+) 또는 하락(-) 여부
  prdy_ctrt: string; // 전일 대비 등락률(%)
  stck_prdy_clpr: string; // 전일 종가
  acml_vol: string; // 누적 거래량
  acml_tr_pbmn: string; // 누적 거래대금
  hts_kor_isnm: string; // 종목명 (한국어)
  stck_prpr: string; // 현재가
  stck_shrn_iscd: string; // 종목 코드
  prdy_vol: string; // 당일 거래량
  stck_mxpr: string; // 최고가
  stck_llam: string; // 최저가
  stck_oprc: string; // 시가 (당일 시작 가격)
  stck_hgpr: string; // 당일 최고가
  stck_lwpr: string; // 당일 최저가
  stck_prdy_oprc: string; // 전일 시가
  stck_prdy_hgpr: string; // 전일 최고가
  stck_prdy_lwpr: string; // 전일 최저가
  askp: string; // 매도 호가
  bidp: string; // 매수 호가
  prdy_vrss_vol: string; // 전일 대비 거래량 차이
  vol_tnrt: string; // 거래량 회전율
  stck_fcam: string; // 액면가
  lstn_stcn: string; // 상장 주식 수
  cpfn: string; // 자본금
  hts_avls: string; // 시가총액
  per: string; // 주가수익비율 (PER)
  eps: string; // 주당순이익 (EPS)
  pbr: string; // 주가순자산비율 (PBR)
  itewhol_loan_rmnd_rate: string | null; // 대출 잔여율 (null일 수 있음)
  stck_bsop_date: string | null; // 기준일 (null일 수 있음)
}

export const getIndividualStockData = async (
  stockId: string
): Promise<IndividualStockDataResponse> => {
  try {
    const response = await axiosInstance.get<IndividualStockDataResponse>(
      `api/stock/${stockId}`
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
