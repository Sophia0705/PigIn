// src/store/memberStore.ts
import { create } from 'zustand'; // 명시적 내보내기 사용

// formData의 타입 정의
interface FormData {
  name: string;
  phoneNumber: string;
  birth: string;
  email: string;
  password: string;
  passwordConfirm: string;
  authNumber: string;
  savingRate: number;
}

// Zustand 스토어의 타입 정의
interface memberStore {
  formData: FormData; // formData 상태
  setFormData: (newFormData: Partial<FormData>) => void; // 상태를 업데이트하는 함수
  loadUserData: () => void; // 사용자 데이터를 로드하는 함수
}

// Zustand 스토어 생성: 상태와 상태 변경 함수를 정의합니다.
export const useStore = create<memberStore>((set) => ({
  formData: {
    name: '',
    phoneNumber: '',
    birth: '',
    email: '',
    password: '',
    passwordConfirm: '',
    authNumber: '',
    savingRate: 0,
  },
  // 상태를 업데이트하는 함수: 기존 상태를 유지하면서 새로운 입력값을 적용합니다.
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData },
    })),
  // 사용자 데이터를 로드하는 함수
  loadUserData: () => {
    // 예시 더미 데이터 로드
    set({
      formData: {
        name: '홍길동',
        phoneNumber: '010-1234-5678',
        birth: '900101',
        email: 'hong@example.com',
        password: '',
        passwordConfirm: '',
        authNumber: '',
        savingRate: 5,
      },
    });
  },
}));
