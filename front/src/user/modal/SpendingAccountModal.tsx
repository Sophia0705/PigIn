import React from 'react';

interface SpendingAccountCompleteModalProps {
  setShowModal: (show: boolean) => void;
}

const SignUpCompleteModal: React.FC<SpendingAccountCompleteModalProps> = ({
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mt-5 mb-10 text-center">
          소비 계좌가 개설되었습니다.
        </h2>
        <button
          onClick={() => setShowModal(false)}
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SignUpCompleteModal;
