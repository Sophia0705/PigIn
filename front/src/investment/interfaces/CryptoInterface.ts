export interface CryptoItemData {
  coin: string; // 암호화폐 코드 (예: KRW-BTC)
  date: string; // 날짜 (예: "20240928", 문자열로 그대로 유지)
  open: number; // 시가 (24시간 기준 시작가, 숫자형으로 처리)
  close: number; // 종가 (24시간 기준 마감가, 숫자형으로 처리)
  high: number; // 최고가 (24시간 기준, 숫자형으로 처리)
  low: number; // 최저가 (24시간 기준, 숫자형으로 처리)
  volume: number; // 거래량 (24시간 기준, 숫자형으로 처리)
}

export interface CryptoListData {
  coinName: string;
  coinCode: string;
  price: string;
  priceChange: string;
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
