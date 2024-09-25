import React from 'react';

interface BirthInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const BirthInput: React.FC<BirthInputProps> = ({
  value,
  onChange,
  isValid,
}) => {
  return (
    <div>
      <input
        type="text"
        name="birth"
        value={value}
        onChange={onChange}
        placeholder="생년월일 (예: 000101)"
        className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
          isValid
            ? 'border-gray-300 focus:ring-green-300'
            : 'border-red-500 focus:ring-red-500'
        }`}
      />
      {!isValid && (
        <p className="text-xs text-red-500 mt-1">
          유효한 생년월일을 입력해주세요.
        </p>
      )}
    </div>
  );
};

export default BirthInput;
