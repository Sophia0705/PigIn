import React from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand store 사용

const EmailInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 상태와 상태 업데이트 함수 가져오기
  const isValidEmail =
    formData.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email); // 이메일 유효성 검사

  // 이메일 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value }); // Zustand의 formData 업데이트
  };

  return (
    <div>
      <input
        type="email"
        name="email"
        value={formData.email} // Zustand에서 관리하는 email 값 사용
        onChange={handleChange} // 입력 필드 변경 시 상태 업데이트
        placeholder="이메일"
        className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
          isValidEmail
            ? 'border-gray-300 focus:ring-green-300'
            : 'border-red-500 focus:ring-red-500'
        }`}
        required
      />
      {!isValidEmail && (
        <p className="text-xs text-red-500 mt-1">
          유효한 이메일 주소를 입력해주세요.
        </p>
      )}
    </div>
  );
};

export default EmailInput;
