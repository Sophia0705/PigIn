import React from 'react';

interface FindPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindPasswordModal: React.FC<FindPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2>비밀번호 찾기</h2>
        <form>{/* 비밀번호 찾기 폼 */}</form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default FindPasswordModal;
