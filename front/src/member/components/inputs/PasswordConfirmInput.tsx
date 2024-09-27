import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface PasswordConfirmInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMatch: boolean;
  showPasswordConfirm: boolean;
  toggleShowPasswordConfirm: () => void;
}

const PasswordConfirmInput: React.FC<PasswordConfirmInputProps> = ({
  value,
  onChange,
  isMatch,
  showPasswordConfirm,
  toggleShowPasswordConfirm,
}) => {
  return (
    <div className="relative flex items-center">
      <input
        type={showPasswordConfirm ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder="비밀번호 확인"
        className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        type="button"
        onClick={toggleShowPasswordConfirm}
        className="absolute right-8 text-gray-500 bg-transparent"
      >
        {showPasswordConfirm ? (
          <AiOutlineEyeInvisible className="bg-transparent" />
        ) : (
          <AiOutlineEye className="bg-transparent" />
        )}
      </button>
      {!isMatch && (
        <p className="text-xs text-red-500 mt-1">
          비밀번호가 일치하지 않습니다.
        </p>
      )}
    </div>
  );
};

export default PasswordConfirmInput;
