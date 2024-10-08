export interface CryptoItemData {
  coin: string; // 암호화폐 코드 (예: KRW-BTC)
  coinName: string; // 한글 이름
  date: string; // 날짜 (예: "20240928")
  open: number; // 시가 (24시간 기준 시작가)
  close: number; // 종가 (24시간 기준 마감가)
  high: number; // 최고가 (24시간 기준)
  low: number; // 최저가 (24시간 기준)
  volume: number; // 거래량 (24시간 기준)
  price: number; // 현재가 (CryptoListData에서 추가됨)
  priceChange: number; // 전일 대비 증감액 (CryptoListData에서 추가됨)
  weeklyPrices: number[]; // 주간 가격 데이터 (CryptoChartData에서 추가됨)
  monthlyPrices: number[]; // 월간 데이터
  yearlyPrices: number[]; // 연간 데이터
}

export interface CryptoLiveData {
  acml_vol: number;
  coinCode: string;
  coin_bsop_date: string;
  coin_bsop_time: string;
  coin_clpr: number;
  coin_hgpr: number;
  coin_lwpr: number;
  coin_oprc: number;
}

export interface CryptoListData {
  coinName: string;
  coin: string;
  price: string;
  priceChange: number;
}

export interface CryptoChartData {
  coinCode: string; // 암호화폐 코드 (예: "KRW-BTC")
  coin_bsop_date: string; // 거래일자 (YYYYMMDD 형식)
  coin_bsop_time: string; // 거래시간 (HHMMSS 형식)
  coin_clpr: number; // 종가 (해당 시간대의 마감 가격)
  coin_oprc: number; // 시가 (해당 시간대의 시작 가격)
  coin_hgpr: number; // 최고가 (해당 시간대의 최고 가격)
  coin_lwpr: number; // 최저가 (해당 시간대의 최저 가격)
  acml_vol: number; // 누적 거래량 (해당 시간대 동안의 누적 거래량)
}

export interface CryptoNews {
  Date: string;
  NewsCompany: string;
  NewsTitle: string;
  Link: string;
}

export interface CryptoFavorite {
  result: boolean;
}
