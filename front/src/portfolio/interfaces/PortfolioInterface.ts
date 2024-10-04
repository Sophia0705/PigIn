export interface AssetItem {
  name: string;
  quantity: number;
  price: number;
  profitRate: number;
  categoryName?: string;
}

export interface AssetCategory {
  name: string;
  totalValue: number;
  items: AssetItem[];
}

export interface PortfolioState {
  categories: AssetCategory[];
  totalValue: number;
  totalProfit: number;
  totalProfitRate: number;
  activeIndex: number | undefined;
  showAllItems: boolean;
  setShowAllItems: (show: boolean) => void;
  isLoading: boolean;
  error: string | null;
  setActiveIndex: (index: number | undefined) => void;
  fetchPortfolioData: () => Promise<void>;
}
