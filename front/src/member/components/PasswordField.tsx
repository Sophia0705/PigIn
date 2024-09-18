import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // 확인 아이콘

interface PasswordFieldProps {
  password: string;
  showPassword: boolean;
  isPasswordValid: (password: string) => boolean;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  password,
  showPassword,
  isPasswordValid,
  handlePasswordChange,
  toggleShowPassword,
}) => {
  return (
    <div className="relative flex items-center">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-8 top-2 text-gray-500"
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
  );
};

export default PasswordField;
