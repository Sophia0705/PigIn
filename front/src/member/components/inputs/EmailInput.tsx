import React from 'react';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  isValid,
}) => {
  return (
    <div>
      <input
        type="email"
        name="email"
        value={value}
        onChange={onChange}
        placeholder="이메일"
        className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
          isValid
            ? 'border-gray-300 focus:ring-green-300'
            : 'border-red-500 focus:ring-red-500'
        }`}
        required
      />
      {!isValid && (
        <p className="text-xs text-red-500 mt-1">
          유효한 이메일 주소를 입력해주세요.
        </p>
      )}
    </div>
  );
};

export default EmailInput;
