import { create } from 'zustand';
import { getAccessToken, removeAccessToken } from '../utils/localUtils';

// formData의 타입 정의
interface FormData {
  name: string; // 이름
  phoneNumber: string; // 전화번호
  birth: string; // 생년월일
  email: string; // 이메일
  password: string; // 기존 비밀번호
  newPassword: string; // 새 비밀번호
  passwordConfirm: string; // 비밀번호 확인
  newPasswordConfirm: string; // 새 비밀번호 확인
  authNumber: string; // 인증번호
  savingRate: number; // 저축률
  isPhoneVerified: boolean; // 핸드폰 인증 여부
}

// 모달 상태 타입 정의
interface ModalState {
  isLoginModalOpen: boolean; // 로그인 모달 열림 여부
  isSignUpModalOpen: boolean; // 회원가입 모달 열림 여부
  isFindEmailModalOpen: boolean; // 아이디 찾기 모달 열림 여부
  isFindPasswordModalOpen: boolean; // 비밀번호 찾기 모달 열림 여부
  isIsLoginModalOpen: boolean; // 로그인 여부 모달 열림 여부
  isUpdateProfileModalOpen: boolean; // 회원 정보 수정 모달 열림 여부
  isSignOutModalOpen: boolean; // 회원 탈퇴 모달 열림 여부
  isSpendingAccountRegisterModalOpen: boolean; // 소비 계좌 등록 모달 열림 여부
}

// Zustand 스토어의 타입 정의
interface MemberStore extends ModalState {
  formData: FormData; // 사용자 폼 데이터
  isLoggedIn: boolean; // 로그인 상태 여부
  setFormData: (newFormData: Partial<FormData>) => void; // 폼 데이터 업데이트 함수
  setPhoneVerified: (isVerified: boolean) => void; // 핸드폰 인증 여부 업데이트 함수
  checkLoginStatus: () => void; // 로그인 상태 확인 함수
  logout: () => void; // 로그아웃 함수

  // 모달 열기/닫기 함수
  openLoginModal: () => void; // 로그인 모달 열기 함수
  closeLoginModal: () => void; // 로그인 모달 닫기 함수
  openSignUpModal: () => void; // 회원가입 모달 열기 함수
  closeSignUpModal: () => void; // 회원가입 모달 닫기 함수
  openFindEmailModal: () => void; // 아이디 찾기 모달 열기 함수
  closeFindEmailModal: () => void; // 아이디 찾기 모달 닫기 함수
  openFindPasswordModal: () => void; // 비밀번호 찾기 모달 열기 함수
  closeFindPasswordModal: () => void; // 비밀번호 찾기 모달 닫기 함수
  openIsLoginModal: () => void; // 로그인 여부 모달 열기 함수
  closeIsLoginModal: () => void; // 로그인 여부 모달 닫기 함수
  openUpdateProfileModal: () => void; // 회원 정보 수정 모달 열기 함수
  closeUpdateProfileModal: () => void; // 회원 정보 수정 모달 닫기 함수
  openSignOutModal: () => void; // 회원 탈퇴 모달 열기 함수
  closeSignOutModal: () => void; // 회원 탈퇴 모달 닫기 함수
  openSpendingAccountRegisterModal: () => void; // 소비 계좌 등록 모달 열기 함수
  closeSpendingAccountRegisterModal: () => void; // 소비 계좌 등록 모달 닫기 함수
}

// Zustand 스토어 생성
export const useMemberStore = create<MemberStore>((set) => ({
  // 초기 formData 상태
  formData: {
    name: '', // 이름 초기값
    phoneNumber: '', // 전화번호 초기값
    birth: '', // 생년월일 초기값
    email: '', // 이메일 초기값
    password: '', // 기존 비밀번호 초기값
    newPassword: '', // 새 비밀번호 초기값
    passwordConfirm: '', // 비밀번호 확인 초기값
    newPasswordConfirm: '', // 새로운 상태로 변경
    authNumber: '', // 인증번호 초기값
    savingRate: 0, // 저축률 초기값
    isPhoneVerified: false, // 핸드폰 인증 여부 초기값
  },

  // 초기 모달 상태
  isIsLoginModalOpen: false, // 로그인 여부 모달 초기 상태
  isLoginModalOpen: false, // 로그인 모달 초기 상태
  isSignUpModalOpen: false, // 회원가입 모달 초기 상태
  isFindEmailModalOpen: false, // 아이디 찾기 모달 초기 상태
  isFindPasswordModalOpen: false, // 비밀번호 찾기 모달 초기 상태
  isUpdateProfileModalOpen: false, // 회원 정보 수정 모달 초기 상태
  isSignOutModalOpen: false, // 회원 탈퇴 모달 초기 상태
  isSpendingAccountRegisterModalOpen: false, // 소비 계좌 등록 모달 초기 상태

  // 로그인 여부 초기 상태
  isLoggedIn: false,

  // 상태를 업데이트하는 함수 (부분 업데이트)
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData }, // 기존 상태를 유지하면서 새로운 데이터 병합
    })),

  // 로그인 상태 확인 함수 (토큰이 있으면 로그인 상태로 변경)
  checkLoginStatus: () => {
    const token = getAccessToken();
    set({ isLoggedIn: !!token }); // 토큰이 존재하면 로그인 상태로 설정
  },

  // 핸드폰 인증 여부 업데이트 함수
  setPhoneVerified: (isVerified: boolean) =>
    set((state) => ({
      formData: { ...state.formData, isPhoneVerified: isVerified },
    })),

  // 로그아웃 함수 (토큰 삭제 후 로그아웃 상태로 변경)
  logout: () => {
    removeAccessToken();
    set({ isLoggedIn: false }); // 로그아웃 상태로 변경
  },

  // 모달 열기/닫기 함수 정의
  openLoginModal: () => set({ isLoginModalOpen: true }), // 로그인 모달 열기
  closeLoginModal: () => set({ isLoginModalOpen: false }), // 로그인 모달 닫기
  openSignUpModal: () => set({ isSignUpModalOpen: true }), // 회원가입 모달 열기
  closeSignUpModal: () => set({ isSignUpModalOpen: false }), // 회원가입 모달 닫기
  openFindEmailModal: () => set({ isFindEmailModalOpen: true }), // 아이디 찾기 모달 열기
  closeFindEmailModal: () => set({ isFindEmailModalOpen: false }), // 아이디 찾기 모달 닫기
  openFindPasswordModal: () => set({ isFindPasswordModalOpen: true }), // 비밀번호 찾기 모달 열기
  closeFindPasswordModal: () => set({ isFindPasswordModalOpen: false }), // 비밀번호 찾기 모달 닫기
  openIsLoginModal: () => set({ isIsLoginModalOpen: true }), // 로그인 여부 모달 열기
  closeIsLoginModal: () => set({ isIsLoginModalOpen: false }), // 로그인 여부 모달 닫기
  openUpdateProfileModal: () => set({ isUpdateProfileModalOpen: true }), // 회원 정보 수정 모달 열기
  closeUpdateProfileModal: () => set({ isUpdateProfileModalOpen: false }), // 회원 정보 수정 모달 닫기
  openSignOutModal: () => set({ isSignOutModalOpen: true }), // 회원 탈퇴 모달 열기
  closeSignOutModal: () => set({ isSignOutModalOpen: false }), // 회원 탈퇴 모달 닫기
  openSpendingAccountRegisterModal: () =>
    set({ isSpendingAccountRegisterModalOpen: true }), // 소비 계좌 등록 모달 열기
  closeSpendingAccountRegisterModal: () =>
    set({ isSpendingAccountRegisterModalOpen: false }), // 소비 계좌 등록 모달 닫기
}));
