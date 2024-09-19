export interface CryptoItemData {
  name: string; // 이름
  symbol: string; // 암호화폐 코드 (예: BTC, ETH)
  price: number; // 현재가 (USD 기준)
  marketCap: string; // 시가총액 (예: "1.1조")
  volume: string; // 거래량 (24시간 기준, 예: "35B")
  percentageChange: string; // 전일 대비 등락률 (예: "+2.15%")
  openPrice: number; // 시가 (24시간 기준 시작가)
  closePrice: number; // 종가 (24시간 기준 마감가)
  high: number; // 최고가 (24시간 기준)
  low: number; // 최저가 (24시간 기준)
  weeklyPrices: number[]; // 주간 가격 데이터
  monthlyPrices: number[]; // 월간 가격 데이터
}
