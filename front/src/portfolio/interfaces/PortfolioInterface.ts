export interface AssetItem {
  name: string;
  quantity: number;
  price: number;
  profitRate: number;
}

export interface AssetCategory {
  name: string;
  totalValue: number;
  items: AssetItem[];
}

export interface PortfolioState {
  categories: AssetCategory[];
  totalValue: number; // 총 가격(가격 합)
  totalProfit: number; // 총 이익
  totalProfitRate: number; // 총 이익률
  activeIndex: number | undefined; // 파이차트 선택 위한 activeIndex
  showAllItems: boolean;
  setShowAllItems: (show: boolean) => void;
  isLoading: boolean;
  error: string | null;
  setActiveIndex: (index: number | undefined) => void;
  fetchPortfolioData: () => Promise<void>;
}
