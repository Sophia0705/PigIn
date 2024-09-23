import React from 'react';

interface VerificationModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  showModal,
  setShowModal,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">인증번호가 전송되었습니다.</h2>
        <button
          onClick={() => setShowModal(false)}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        > 
          확인
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;
