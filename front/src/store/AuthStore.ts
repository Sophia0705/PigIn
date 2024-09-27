// src/store/authStore.ts
import create from 'zustand';

// Zustand 스토어 정의
interface AuthState {
  isLoggedIn: boolean; // 로그인 여부
  isLoginModalOpen: boolean; // 로그인 모달 상태
  checkLoginStatus: () => void; // 로그인 여부를 확인하는 함수
  openLoginModal: () => void; // 로그인 모달 열기
  closeLoginModal: () => void; // 로그인 모달 닫기
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 초기 상태: 로그아웃
  isLoginModalOpen: false, // 초기 상태: 모달 닫힘

  // 로그인 상태 확인
  checkLoginStatus: () => {
    const token = localStorage.getItem('accessToken'); // localStorage에서 액세스 토큰 확인
    if (token) {
      set({ isLoggedIn: true, isLoginModalOpen: false }); // 로그인 상태로 설정
    } else {
      set({ isLoggedIn: false, isLoginModalOpen: true }); // 로그아웃 상태 & 모달 열기
    }
  },

  // 모달 열기
  openLoginModal: () => set({ isLoginModalOpen: true }),

  // 모달 닫기
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
