import React from "react";

interface AuthRequestButtonProps {
  phoneNumber: string;
  requestVerificationCode: () => void;
}

const AuthRequestButton: React.FC<AuthRequestButtonProps> = ({
  phoneNumber,
  requestVerificationCode,
}) => {
  return (
    <button
      type="button"
      onClick={requestVerificationCode}
      className={`p-2 rounded ${
        phoneNumber.length === 13
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
      disabled={phoneNumber.length !== 13}
    >
      인증 요청
    </button>
  );
};

export default AuthRequestButton;
