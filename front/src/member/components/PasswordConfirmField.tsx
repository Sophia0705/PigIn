import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // 확인 아이콘

interface PasswordConfirmFieldProps {
  passwordConfirm: string;
  showPasswordConfirm: boolean;
  isPasswordMatch: boolean;
  handlePasswordConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPasswordConfirm: () => void;
}

const PasswordConfirmField: React.FC<PasswordConfirmFieldProps> = ({
  passwordConfirm,
  showPasswordConfirm,
  isPasswordMatch,
  handlePasswordConfirmChange,
  toggleShowPasswordConfirm,
}) => {
  return (
    <div className="relative flex items-center">
      <input
        type={showPasswordConfirm ? "text" : "password"}
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
        placeholder="비밀번호 확인"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        type="button"
        onClick={toggleShowPasswordConfirm}
        className="absolute right-8 top-2 text-gray-500"
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
  );
};

export default PasswordConfirmField;
