import React from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand store 사용

const NameInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 상태와 상태 업데이트 함수 가져오기

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value }); // Zustand의 formData 업데이트
  };

  return (
    <input
      type="text"
      name="name"
      value={formData.name} // Zustand에서 관리하는 name 값 사용
      onChange={handleChange} // 입력 필드 변경 시 상태 업데이트
      placeholder="이름"
      className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      required
    />
  );
};

export default NameInput;
