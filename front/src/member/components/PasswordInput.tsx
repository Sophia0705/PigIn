import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

interface PasswordInputProps {
  password: string;
  passwordConfirm: string;
  isPasswordMatch: boolean;
  setPassword: (password: string) => void;
  setPasswordConfirm: (passwordConfirm: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  passwordConfirm,
  isPasswordMatch,
  setPassword,
  setPasswordConfirm,
}) => {
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태

  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  return (
    <>
      {/* 비밀번호 입력 필드 */}
      <div className="relative flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-8 text-gray-500 bg-transparent"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
        {/* 비밀번호 유효성 체크 아이콘 */}
        {password &&
          (isPasswordValid(password) ? (
            <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
          ) : (
            <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
          ))}
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className="relative flex items-center mt-4">
        <input
          type={showPasswordConfirm ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="button"
          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          className="absolute right-8 text-gray-500 bg-transparent"
        >
          {showPasswordConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
        {/* 비밀번호 일치 여부에 따른 아이콘 표시 */}
        {passwordConfirm &&
          (isPasswordMatch ? (
            <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
          ) : (
            <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
          ))}
      </div>
    </>
  );
};

export default PasswordInput;
