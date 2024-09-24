// 페이지 확인 위해서 임시로 만든 store -> api 따라 수정 예정
import { create } from "zustand";

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
  setInvestmentAmount: (amount: number) => void;
  setAllocations: (newAllocations: Allocations) => void;
  setActiveCategory: (category: string) => void;
  isAutoInvestmentEnabled: boolean;
  setIsAutoInvestmentEnabled: (isEnabled: boolean) => void;
};

export const useAutoInvestmentStore = create<AutoInvestmentState>((set) => ({
  investmentAmount: 0,
  allocations: {
    주식: [{ symbol: "AAPL", percentage: 50 }],
    가상화폐: [],
    금: [],
  },
  activeCategory: "주식",
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setAllocations: (newAllocations) => set({ allocations: newAllocations }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  isAutoInvestmentEnabled: false,
  setIsAutoInvestmentEnabled: (isEnabled) =>
    set({ isAutoInvestmentEnabled: isEnabled }),
}));
