import React from 'react';

interface FindEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindEmailModal: React.FC<FindEmailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2>아이디 찾기</h2>
        <form>{/* 아이디 찾기 폼 */}</form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default FindEmailModal;
