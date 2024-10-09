import React from 'react';
import { useMemberStore } from '../../../store/memberStore'; // zustand 스토어 가져오기

const IsLoginModal: React.FC = () => {
  const { isIsLoginModalOpen, closeIsLoginModal, openLoginModal } =
    useMemberStore();

  if (!isIsLoginModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleLoginClick = () => {
    closeIsLoginModal(); // 현재 모달을 닫고
    openLoginModal(); // 로그인 모달을 열기
  };

  const handleCancelClick = () => {
    closeIsLoginModal();
  };

  return (
    <div
      className="modal-content fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20"
      onClick={closeIsLoginModal}
    >
      <div
        className="bg-white p-6 text-black rounded-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        <h2 className="text-lg font-semibold mb-4">로그인이 필요합니다</h2>
        <p className="mb-6">로그인 페이지로 이동하시겠습니까?</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={handleCancelClick}
          >
            취소
          </button>
          <button
            className="bg-customAqua text-grey font-bold py-2 px-4 rounded"
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLoginModal;
