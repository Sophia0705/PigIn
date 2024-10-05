import { create } from 'zustand';
import { fetchPortfolioData } from '../api/portfolio/portfolio';
import {
  PortfolioStore,
  PortfolioData,
} from '../portfolio/interfaces/PortfolioInterface';

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  stockPrice: 0,
  cryptoPrice: 0,
  goldPrice: 0,
  totalPrice: 0,
  stocks: [],
  cryptocurrencies: [],
  gold: [],
  isLoading: false,
  error: null,
  activeIndex: undefined,
  showAllItems: true,

  setActiveIndex: (index: number | undefined) =>
    set({ activeIndex: index, showAllItems: false }),
  setShowAllItems: (show: boolean) =>
    set({ showAllItems: show, activeIndex: undefined }),

  fetchPortfolioData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data: PortfolioData = await fetchPortfolioData();
      set({ ...data, isLoading: false });
    } catch (error) {
      set({
        error: '포트폴리오 데이터를 불러오는 데 실패했습니다.',
        isLoading: false,
      });
      console.error(
        'Error fetching portfolio data:',
        error instanceof Error ? error.message : String(error)
      );
    }
  },
}));
