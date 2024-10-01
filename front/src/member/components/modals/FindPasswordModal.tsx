import React, { useState } from 'react';

const FindPasswordModal: React.FC = () => {
  // 상태와 함수들
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  // 모달 닫기 함수
  const closeFindPasswordModal = () => {
    // 모달 닫기 동작 정의
  };

  // 폼 제출 처리 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 비밀번호 찾기 로직 처리
    console.log('비밀번호 찾기 요청:', { name, email, phoneNumber });
  };

  return (
    // 모달 배경
    <div className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 모달 본체 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-up">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          비밀번호 찾기
        </h2>
        <button
          onClick={closeFindPasswordModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          X
        </button>

        {/* 비밀번호 찾기 폼 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            비밀번호 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPasswordModal;
