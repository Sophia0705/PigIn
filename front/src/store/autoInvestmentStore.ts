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
    주식: [
      { symbol: 'AAPL', percentage: 50 },
      { symbol: '삼성전자', percentage: 50 },
      { symbol: '삼성전자1', percentage: 50 },
      { symbol: '삼성전자2', percentage: 50 },
      { symbol: '삼성전자3', percentage: 50 },
      { symbol: '삼성전자4', percentage: 50 },
      { symbol: '삼성전자5', percentage: 50 },
      { symbol: '삼성전자6', percentage: 50 },
      { symbol: '삼성전자7', percentage: 50 },
      { symbol: '삼성전자8', percentage: 50 },
      { symbol: '삼성전자9', percentage: 50 },
      { symbol: '삼성전자00', percentage: 50 },
      { symbol: '삼성전자44', percentage: 50 },
    ],
    가상화폐: [{ symbol: '비트코인', percentage: 50 }],
    금: [{ symbol: '금', percentage: 50 }],
  },
  activeCategory: '주식',
  isAutoInvestmentEnabled: false,
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setAllocations: (newAllocations) => set({ allocations: newAllocations }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setIsAutoInvestmentEnabled: (isEnabled) =>
    set({ isAutoInvestmentEnabled: isEnabled }),
}));
