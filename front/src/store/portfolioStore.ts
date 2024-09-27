import { create } from 'zustand';
import portfolioData from './portfolio.json';

interface AssetItem {
  name: string;
  quantity: number;
  price: number;
  profitRate: number;
}

interface AssetCategory {
  name: string;
  totalValue: number;
  items: AssetItem[];
}

interface PortfolioState {
  categories: AssetCategory[];
  totalValue: number;
  totalProfit: number;
  totalProfitRate: number;
  activeIndex: number | undefined;
  isLoading: boolean;
  error: string | null;
  setActiveIndex: (index: number | undefined) => void;
  fetchPortfolioData: () => Promise<void>;
}

const calculatePortfolioMetrics = (data: any) => {
  const calculateCategoryInitialInvestment = (items: any[]) =>
    items.reduce((sum, item) => {
      const currentValue = item.quantity * item.price;
      // 수익률이 음수일 때도 동일한 계산식 적용
      const initialInvestment = currentValue / (1 + item.profitRate);
      return sum + initialInvestment;
    }, 0);

  const totalInitialInvestment =
    calculateCategoryInitialInvestment(data.stocks) +
    calculateCategoryInitialInvestment(data.gold) +
    calculateCategoryInitialInvestment(data.cryptocurrencies) +
    calculateCategoryInitialInvestment(data.foreignCurrencies);

  const totalValue = data.totalPrice;
  const totalProfit = totalValue - totalInitialInvestment;
  const totalProfitRate = (totalProfit / totalInitialInvestment) * 100;
  // console.log('스토어', totalProfit);
  return {
    totalInitialInvestment,
    totalProfit,
    totalProfitRate,
  };
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  categories: [],
  totalValue: 0,
  totalProfit: 0,
  totalProfitRate: 0,
  activeIndex: undefined,
  isLoading: false,
  error: null,
  setActiveIndex: (index) => set({ activeIndex: index }),
  fetchPortfolioData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = portfolioData;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newCategories: AssetCategory[] = [
        { name: '주식', totalValue: data.stockPrice, items: data.stocks },
        { name: '금', totalValue: data.goldPrice, items: data.gold },
        {
          name: '가상화폐',
          totalValue: data.cryptoPrice,
          items: data.cryptocurrencies,
        },
        {
          name: '외화',
          totalValue: data.foreignCurrencyPrice,
          items: data.foreignCurrencies,
        },
      ];

      // 여기서 수정된 로직 적용
      const { totalProfit, totalProfitRate } = calculatePortfolioMetrics(data);

      set({
        categories: newCategories,
        totalValue: data.totalPrice,
        totalProfit,
        totalProfitRate,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: '포트폴리오 데이터를 불러오는 데 실패했습니다.',
        isLoading: false,
      });
    }
  },
}));
