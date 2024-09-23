import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IsLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<IsLoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose(); // 모달 닫기
    navigate('/login'); // LoginPage.tsx로 이동
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">로그인이 필요합니다</h2>
        <p className="mb-6">로그인 페이지로 이동하시겠습니까?</p>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
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

export default LoginModal;
