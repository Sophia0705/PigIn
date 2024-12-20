import { create } from 'zustand';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import { PortfolioState } from '../portfolio/interfaces/PortfolioInterface';

export const usePortfolioStore = create<PortfolioState>((set) => ({
  stockPrice: 0,
  cryptoPrice: 0,
  goldPrice: 0,
  totalPrice: 0,
  stocks: [],
  cryptocurrencies: [],
  gold: [],
  activeIndex: undefined,
  showAllItems: true,
  isLoading: false,
  error: null,

  setShowAllItems: (show) => set({ showAllItems: show }),
  setActiveIndex: (index) => set({ activeIndex: index }),

  fetchPortfolioData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchPortfolioData();
      set({
        ...data,
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
