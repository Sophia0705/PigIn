import React from 'react';

interface AuthNumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthNumberInput: React.FC<AuthNumberInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="인증번호 입력"
      className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      maxLength={6}
    />
  );
};

export default AuthNumberInput;
