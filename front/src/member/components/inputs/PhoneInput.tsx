import React from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerifyClick: () => void;
  isValid: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, onVerifyClick, isValid }) => {
  return (
    <div className="flex space-x-2 items-center">
      <input
        type="text"
        name="phoneNumber"
        value={value}
        onChange={onChange}
        placeholder="전화번호 (예: 01012345678)"
        className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        maxLength={13}
      />
      <button
        type="button"
        onClick={onVerifyClick}
        className={`p-2 rounded ${
          isValid
            ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#7ee9ce]'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isValid}
      >
        인증 요청
      </button>
    </div>
  );
};

export default PhoneInput;
