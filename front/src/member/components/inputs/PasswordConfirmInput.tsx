import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PasswordConfirmInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 비밀번호 확인 상태 및 함수 가져오기
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 표시 여부
  const passwordConfirm = formData.passwordConfirm; // Zustand에서 비밀번호 확인 가져오기
  const password = formData.password; // 비밀번호 상태 가져오기

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ passwordConfirm: e.target.value }); // 비밀번호 확인 상태 변경
  };

  const isPasswordMatch = password === passwordConfirm; // 비밀번호 일치 여부

  return (
    <div className="relative flex flex-col space-y-2">
      {' '}
      {/* 비밀번호 입력 칸과 동일한 스타일 적용 */}
      <div className="relative flex items-center">
        <input
          type={showPasswordConfirm ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          placeholder="새 비밀번호 확인"
          className="w-full p-3 text-base border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="button"
          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          className="absolute right-8 text-gray-500 bg-transparent"
        >
          {showPasswordConfirm ? (
            <AiOutlineEyeInvisible className="bg-transparent" />
          ) : (
            <AiOutlineEye className="bg-transparent" />
          )}
        </button>
        {passwordConfirm &&
          (isPasswordMatch ? (
            <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
          ) : (
            <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
          ))}
      </div>
      <hr className="w-full border-t border-gray-300" />{' '}
    </div>
  );
};

export default PasswordConfirmInput;
