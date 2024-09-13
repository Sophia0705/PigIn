// src/store.ts
import { create } from 'zustand'; // 명시적 내보내기 사용

// formData의 타입 정의
interface FormData {
  name: string;
  phoneNumber: string;
  birth: string;
  email: string;
  password: string;
}

// Zustand 스토어의 타입 정의
interface Store {
  formData: FormData; // formData 상태
  setFormData: (newFormData: Partial<FormData>) => void; // 상태를 업데이트하는 함수
}

// Zustand 스토어 생성: 상태와 상태 변경 함수를 정의합니다.
export const useStore = create<Store>((set) => ({
  formData: {
    name: '',
    phoneNumber: '',
    birth: '',
    email: '',
    password: '',
  },
  // 상태를 업데이트하는 함수: 기존 상태를 유지하면서 새로운 입력값을 적용합니다.
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData },
    })),
}));
