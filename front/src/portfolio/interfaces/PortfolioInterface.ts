export interface StockItem {
  stockCode: string;
  name: string;
  amount: number;
  price: number;
  profitRate: number;
}

export interface CryptoItem {
  coinCode: string;
  name: string;
  amount: number;
  price: number;
  profitRate: number | string; // API에서 "Infinity"를 반환할수도 있어서 string
}

export interface GoldItem {
  name: string;
  quantity: number;
  price: number;
  profitRate: number;
}

export interface PortfolioData {
  stockPrice: number;
  cryptoPrice: number;
  goldPrice: number;
  totalPrice: number;
  stocks: StockItem[];
  cryptocurrencies: CryptoItem[];
  gold: GoldItem[];
}

export interface PortfolioState extends PortfolioData {
  activeIndex: number | undefined;
  showAllItems: boolean;
  isLoading: boolean;
  error: string | null;
  setShowAllItems: (show: boolean) => void;
  setActiveIndex: (index: number | undefined) => void;
  fetchPortfolioData: () => Promise<void>;
}
