// src/store/SpendingAccountStore.ts
import { create } from 'zustand';

// formData의 타입 정의
interface SpendingAccountFormData {
  name: string;
  bankName: string;
  accountNumber: string;
  password: string;
  verificationCode: string;
}

// Zustand 스토어의 타입 정의
interface SpendingAccountStore {
  formData: SpendingAccountFormData; // formData 상태
  setFormData: (newFormData: Partial<SpendingAccountFormData>) => void; // 상태를 업데이트하는 함수
}

// Zustand 스토어 생성: 상태와 상태 변경 함수를 정의
export const useSpendingAccountStore = create<SpendingAccountStore>((set) => ({
  formData: {
    name: '',
    bankName: '',
    accountNumber: '',
    password: '',
    verificationCode: '', // 초기 인증 번호 필드
  },
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData },
    })),
}));
