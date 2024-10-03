export interface GoldItemData {
  date: string;
  srtnCd: string;
  isin: string;
  itemName: string;
  close: number;
  vsYesterday: number;
  upDownRate: number;
  open: number;
  high: number;
  low: number;
  tradeAmount: number;
  tradePrice: number;
  weeklyPrices: number[];
  monthlyPrices: number[];
  threeMonthlyPrices: number[];
  yearlyPrices: number[];
}

export interface GoldChartDataResponse {
  date: string;
  close: string;
}
