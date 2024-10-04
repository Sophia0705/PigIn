import { create } from 'zustand';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import {
  AssetCategory,
  PortfolioState,
} from '../portfolio/interfaces/PortfolioInterface';

export const usePortfolioStore = create<PortfolioState>((set) => ({
  categories: [],
  totalValue: 0,
  totalProfit: 0,
  totalProfitRate: 0,
  activeIndex: undefined,
  showAllItems: false,
  setShowAllItems: (show) => set({ showAllItems: show }),
  isLoading: false,
  error: null,
  setActiveIndex: (index) => set({ activeIndex: index }),
  fetchPortfolioData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPortfolioData();

      const newCategories: AssetCategory[] = [
        { name: '주식', totalValue: data.stockPrice, items: data.stocks },
        { name: '금', totalValue: data.goldPrice, items: data.gold },
        {
          name: '가상화폐',
          totalValue: data.cryptoPrice,
          items: data.cryptocurrencies,
        },
      ];

      set({
        categories: newCategories,
        totalValue: data.totalPrice,
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
