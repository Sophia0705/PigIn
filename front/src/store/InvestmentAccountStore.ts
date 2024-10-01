// src/store/accountStore.ts
import { create } from 'zustand';

// formData의 타입 정의
interface InvestmentAccountFormData {
  name: string;
  phoneNumber: string;
  savingRate: number;
  password: string;
}

// Zustand 스토어의 타입 정의
interface InvestmentAccountStore {
  formData: InvestmentAccountFormData; // formData 상태
  setFormData: (newFormData: Partial<InvestmentAccountFormData>) => void; // 상태를 업데이트하는 함수
}

// Zustand 스토어 생성: 상태와 상태 변경 함수를 정의
export const useInvestmentAccountStore = create<InvestmentAccountStore>(
  (set) => ({
    formData: {
      name: '',
      phoneNumber: '',
      savingRate: 0,
      password: '',
    },
    setFormData: (newFormData) =>
      set((state) => ({
        formData: { ...state.formData, ...newFormData },
      })),
  })
);
