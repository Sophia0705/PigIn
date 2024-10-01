import { create } from 'zustand';

type Allocation = {
  symbol: string;
  percentage: number;
};

type Allocations = {
  [key: string]: Allocation[];
};

type AutoInvestmentState = {
  investmentAmount: number;
  allocations: Allocations;
  activeCategory: string;
  isAutoInvestmentEnabled: boolean;
  setInvestmentAmount: (amount: number) => void;
  setAllocations: (newAllocations: Allocations) => void;
  setActiveCategory: (category: string) => void;
  setIsAutoInvestmentEnabled: (isEnabled: boolean) => void;
};

export const useAutoInvestmentStore = create<AutoInvestmentState>((set) => ({
  investmentAmount: 0,
  allocations: {
    주식: [{ symbol: 'AAPL', percentage: 50 }],
    가상화폐: [],
    금: [],
  },
  activeCategory: '주식',
  isAutoInvestmentEnabled: false,
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setAllocations: (newAllocations) => set({ allocations: newAllocations }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setIsAutoInvestmentEnabled: (isEnabled) =>
    set({ isAutoInvestmentEnabled: isEnabled }),
}));
