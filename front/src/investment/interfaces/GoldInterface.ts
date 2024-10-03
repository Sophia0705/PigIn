export interface GoldItemData {
  date: string;
  srtnCd: string;
  isin: string;
  itemName: string;
  close: string;
  vsYesterday: string;
  upDownRate: string;
  open: string;
  high: string;
  low: string;
  tradeAmount: string;
  tradePrice: string;
}

export interface GoldChartDataResponse {
  date: string;
  close: string;
}
