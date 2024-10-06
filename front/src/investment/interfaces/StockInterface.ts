// 주식 정보
export interface StockItemData {
  hts_kor_isnm: string; // 주식명
  stck_shrn_iscd: string; // 주식 코드
  stck_prpr: number; // 현재가
  prdy_ctrt: string; // 전일 대비 등락률
  weeklyPrices: number[]; // 주간 가격 데이터
  monthlyPrices: number[]; // 월간 가격 데이터
  yearlyPrices: number[]; // 년간 가격 데이터
  stck_oprc: number; // 시가 (당일 시작가)
  stck_prdy_clpr: number; // 전일 종가
  stck_hgpr: number; // 당일 최고가
  stck_lwpr: number; // 당일 최저가
  marketCap: string; // 시가총액
  acml_vol: string; // 누적 거래량
  stck_mxpr: number; // 역대 최고가
  stck_llam: number; // 역대 최저가
  stck_prdy_hgpr: number; // 전일 최고가
  stck_prdy_lwpr: number; // 전일 최저가
  per: string; // 주가수익비율 (PER)
  eps: string; // 주당순이익 (EPS)
  pbr: string; // 주가순자산비율 (PBR)
  cpfn: string; // 주당현금흐름 (Cash Flow Per Share)
  vol_tnrt: string; // 거래대금 회전율
  stck_fcam: string; // 주식 액면가
  lstn_stcn: string; // 상장 주식 수
}

// 차트 그리는데 필요한 주식 정보
export interface StockChartDataResponse {
  stck_bsop_date: string; // 날짜
  stck_clpr: string; // 종가
  stck_oprc: string; // 시가
  stck_hgpr: string; // 최고가
  stck_lwpr: string; // 최저가
  acml_vol: string; // 거래량
}

// 전체 주식 목록
export interface StockListResponse {
  stockName: string; // 종목명 (한국어)
  stockCode: string; // 종목 코드
  price: string; // 현재가
  priceChange: number; // 가격 변동률
}

export interface StockNews {
  Date: string;
  NewsCompany: string;
  NewsTitle: string;
  Link: string;
}

export interface StockFavorite {
  result: boolean;
}
