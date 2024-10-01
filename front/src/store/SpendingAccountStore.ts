import { create } from 'zustand';

// formData의 타입 정의
interface SpendingAccountFormData {
  name: string;
  bankName: string;
  accountNumber: string;
  password: string;
  verificationCode: string;
}

// 모달 상태 타입 정의
interface SpendingAccountStore {
  formData: SpendingAccountFormData; // formData 상태
  isSpendingAccountRegisterModalOpen: boolean; // 소비 계좌 등록 모달 열림 여부
  setFormData: (newFormData: Partial<SpendingAccountFormData>) => void; // 상태를 업데이트하는 함수

  // 모달 열기/닫기 함수
  openSpendingAccountRegisterModal: () => void;
  closeSpendingAccountRegisterModal: () => void;
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
  isSpendingAccountRegisterModalOpen: false, // 소비 계좌 등록 모달 초기 상태

  // 상태를 업데이트하는 함수
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData },
    })),

  // 모달 열기/닫기 함수
  openSpendingAccountRegisterModal: () =>
    set({ isSpendingAccountRegisterModalOpen: true }), // 모달 열기
  closeSpendingAccountRegisterModal: () =>
    set({ isSpendingAccountRegisterModalOpen: false }), // 모달 닫기
}));
