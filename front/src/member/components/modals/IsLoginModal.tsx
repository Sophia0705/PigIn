import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberStore } from '../../../store/memberStore'; // zustand 스토어 가져오기

const IsLoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isIsLoginModalOpen, closeIsLoginModal, openLoginModal } = useMemberStore();

  if (!isIsLoginModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  const handleLoginClick = () => {
    closeIsLoginModal(); // 현재 모달을 닫고
    openLoginModal(); // 로그인 모달을 열기
  };

  const handleCancelClick = () => {
    closeIsLoginModal();
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
