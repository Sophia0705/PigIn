export interface AssetItem {
  name: string;
  amount: number;
  price: number;
  profitRate: number | string;
}

export interface StockItem extends AssetItem {
  stockCode: string;
}

export interface CryptoItem extends AssetItem {
  coinCode: string;
}

export interface PortfolioData {
  stockPrice: number;
  cryptoPrice: number;
  goldPrice: number;
  totalPrice: number;
  stocks: StockItem[];
  cryptocurrencies: CryptoItem[];
  gold: AssetItem[];
}

export interface PortfolioState extends PortfolioData {
  isLoading: boolean;
  error: string | null;
  activeIndex: number | undefined;
  showAllItems: boolean;
}

export interface PortfolioActions {
  fetchPortfolioData: () => Promise<void>;
  setActiveIndex: (index: number | undefined) => void;
  setShowAllItems: (show: boolean) => void;
}

export type PortfolioStore = PortfolioState & PortfolioActions;
