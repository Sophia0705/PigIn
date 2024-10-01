import React from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand store 사용

const BirthInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 상태와 상태 업데이트 함수 가져오기
  const isValidBirth = formData.birth === '' || /^\d{6}$/.test(formData.birth); // 생년월일 유효성 검사 (6자리 숫자)

  // 생년월일 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ birth: e.target.value }); // Zustand의 formData 업데이트
  };

  return (
    <div>
      <input
        type="text"
        name="birth"
        value={formData.birth} // Zustand에서 관리하는 birth 값 사용
        onChange={handleChange} // 입력 필드 변경 시 상태 업데이트
        placeholder="생년월일 (예: 000101)"
        className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
          isValidBirth
            ? 'border-gray-300 focus:ring-green-300'
            : 'border-red-500 focus:ring-red-500'
        }`}
      />
      {!isValidBirth && (
        <p className="text-xs text-red-500 mt-1">
          유효한 생년월일을 입력해주세요.
        </p>
      )}
    </div>
  );
};

export default BirthInput;
