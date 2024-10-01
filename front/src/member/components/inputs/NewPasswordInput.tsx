import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NewPasswordInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 새 비밀번호 상태 및 함수 가져오기
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 여부
  const newPassword = formData.newPassword; // Zustand에서 새 비밀번호 가져오기

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ newPassword: e.target.value }); // 비밀번호 상태 변경
  };

  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  return (
    <div className="relative flex flex-col space-y-2">
      <div className="relative flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={handlePasswordChange}
          placeholder="새 비밀번호"
          className="w-full p-2 text-base border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-8 text-gray-500 bg-transparent"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="bg-transparent" />
          ) : (
            <AiOutlineEye className="bg-transparent" />
          )}
        </button>

        {/* 비밀번호 유효성 체크 아이콘 */}
        {newPassword &&
          (isPasswordValid(newPassword) ? (
            <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
          ) : (
            <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
          ))}
      </div>
      {/* 비밀번호 아래 선과 유효성 설명 */}
      <hr className="w-full border-t border-gray-300" />
      <p className="text-xs text-gray-500 mt-2">8자 이상, 영문, 숫자 포함</p>
    </div>
  );
};

export default NewPasswordInput;
