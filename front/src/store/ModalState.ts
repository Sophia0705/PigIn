import create from 'zustand';

// Modal 상태를 관리하기 위한 스토어 생성
interface ModalState {
  showSuccessModal: boolean; // 성공 모달 표시 상태
  showFailModal: boolean; // 실패 모달 표시 상태
  successMessage: string; // 성공 메시지
  failMessage: string; // 실패 메시지
  setShowSuccessModal: (show: boolean) => void; // 성공 모달 상태 설정 함수
  setShowFailModal: (show: boolean) => void; // 실패 모달 상태 설정 함수
  setSuccessMessage: (message: string) => void; // 성공 메시지 설정 함수
  setFailMessage: (message: string) => void; // 실패 메시지 설정 함수
}

export const useModalStore = create<ModalState>((set) => ({
  showSuccessModal: false,
  showFailModal: false,
  successMessage: '',
  failMessage: '',

  setShowSuccessModal: (show) => set({ showSuccessModal: show }),
  setShowFailModal: (show) => set({ showFailModal: show }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setFailMessage: (message) => set({ failMessage: message }),
}));
