import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand에서 상태 및 함수 가져오기
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const NewPasswordConfirmInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 비밀번호 확인 상태 및 함수 가져오기
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 표시 여부
  const newPasswordConfirm = formData.newPasswordConfirm; // Zustand에서 비밀번호 확인 가져오기
  const newPassword = formData.newPassword; // 새 비밀번호 가져오기

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ newPasswordConfirm: e.target.value }); // 비밀번호 확인 상태 변경
  };

  const isPasswordMatch = newPassword === newPasswordConfirm; // 비밀번호 일치 여부

  return (
    <div className="relative flex flex-col space-y-2">
      <div className="relative flex items-center">
        <input
          type={showPasswordConfirm ? 'text' : 'password'}
          value={newPasswordConfirm}
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
        {newPasswordConfirm &&
          (isPasswordMatch ? (
            <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
          ) : (
            <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
          ))}
      </div>
      <hr className="w-full border-t border-gray-300" />
    </div>
  );
};

export default NewPasswordConfirmInput;
