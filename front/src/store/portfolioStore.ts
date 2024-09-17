import { create } from "zustand";
import portfolioData from "./portfolio.json"; // 테스트용 JSON 파일 import

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
  activeIndex: number | undefined;
  isLoading: boolean;
  error: string | null;
  setActiveIndex: (index: number | undefined) => void;
  fetchPortfolioData: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  categories: [],
  totalValue: 0,
  activeIndex: undefined,
  isLoading: false,
  error: null,
  setActiveIndex: (index) => set({ activeIndex: index }),
  fetchPortfolioData: async () => {
    set({ isLoading: true, error: null });
    try {
      // 일단 JSON 데이터를 사용
      // 나중에 API를 사용할 때 변경할 예정
      const data = portfolioData;

      // 비동기 작업 - API 호출 시 지연을 고려
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newCategories: AssetCategory[] = [
        { name: "주식", totalValue: data.stockPrice, items: data.stocks },
        { name: "금", totalValue: data.goldPrice, items: data.gold },
        {
          name: "가상화폐",
          totalValue: data.cryptoPrice,
          items: data.cryptocurrencies,
        },
        {
          name: "외화",
          totalValue: data.foreignCurrencyPrice,
          items: data.foreignCurrencies,
        },
      ];
      set({
        categories: newCategories,
        totalValue: data.totalPrice,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "포트폴리오 데이터를 불러오는 데 실패했습니다.",
        isLoading: false,
      });
    }
  },
}));
