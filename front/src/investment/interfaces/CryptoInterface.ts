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
