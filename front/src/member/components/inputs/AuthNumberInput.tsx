import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand store 사용

const AuthNumberInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 formData와 업데이트 함수 가져오기
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false); // 인증 확인 버튼 비활성화 여부

  // 인증번호 입력 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ authNumber: e.target.value }); // Zustand에서 관리하는 formData.authNumber 업데이트
  };

  // 인증번호 확인 함수
  const verifyAuthenticationCode = () => {
    // 여기서 실제 인증번호 검증 API를 호출하여 인증번호 확인
    console.log('인증번호 확인:', formData.authNumber);
    setIsVerifyDisabled(true); // 확인 완료 후 버튼 비활성화
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={formData.authNumber} // Zustand에서 관리하는 인증번호 값
        onChange={handleAuthNumberChange} // 입력 필드 변경 시 상태 업데이트
        placeholder="인증번호 입력"
        className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        maxLength={6} // 인증번호는 6자리로 제한
      />
      <button
        type="button"
        onClick={verifyAuthenticationCode}
        className={`p-2 rounded ${
          formData.authNumber.length === 6 && !isVerifyDisabled
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={formData.authNumber.length !== 6 || isVerifyDisabled}
      >
        {isVerifyDisabled ? '확인 완료' : '인증 확인'}
      </button>
    </div>
  );
};

export default AuthNumberInput;
