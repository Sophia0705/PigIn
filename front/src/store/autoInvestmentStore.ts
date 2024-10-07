import { create } from 'zustand';

type Stock = {
  stockCode: string;
  stockName: string;
  percent: number;
};

type Coin = {
  coinCode: string;
  coinName: string;
  percent: number;
};

type Gold = {
  gold: string;
  goldName: string;
  percent: number;
};

type AutoInvestmentState = {
  isEnabled: boolean;
  investmentAmount: number;
  stocks: Stock[];
  coins: Coin[];
  golds: Gold[];
  activeCategory: 'stocks' | 'coins' | 'golds';
  setIsEnabled: (isEnabled: boolean) => void;
  setInvestmentAmount: (amount: number) => void;
  setStocks: (stocks: Stock[]) => void;
  setCoins: (coins: Coin[]) => void;
  setGolds: (golds: Gold[]) => void;
  setActiveCategory: (category: 'stocks' | 'coins' | 'golds') => void;
};

export const useAutoInvestmentStore = create<AutoInvestmentState>((set) => ({
  isEnabled: false,
  investmentAmount: 0,
  stocks: [],
  coins: [],
  golds: [],
  activeCategory: 'stocks',
  setIsEnabled: (isEnabled) => set({ isEnabled }),
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setStocks: (stocks) => set({ stocks }),
  setCoins: (coins) => set({ coins }),
  setGolds: (golds) => set({ golds }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
