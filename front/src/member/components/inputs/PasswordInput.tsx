import React from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  isValid,
  showPassword,
  toggleShowPassword,
}) => {
  return (
    <div className="relative flex items-center">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={value}
        onChange={onChange}
        placeholder="비밀번호"
        className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-8 text-gray-500 bg-transparent"
      >
        {showPassword ? '👁️' : '🙈'}
      </button>
      {!isValid && (
        <p className="text-xs text-red-500 mt-1">
          비밀번호가 유효하지 않습니다.
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
