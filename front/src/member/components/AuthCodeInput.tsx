import React from "react";

interface AuthCodeInputProps {
  authenticationNumber: string;
  handleAuthNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  authenticationNumber,
  handleAuthNumberChange,
}) => {
  return (
    <input
      type="text"
      value={authenticationNumber}
      onChange={handleAuthNumberChange}
      placeholder="인증번호 입력"
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      maxLength={6}
    />
  );
};

export default AuthCodeInput;
