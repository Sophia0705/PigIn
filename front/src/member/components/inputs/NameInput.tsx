import React from 'react';

interface NameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      name="name"
      value={value}
      onChange={onChange}
      placeholder="이름"
      className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      required
    />
  );
};

export default NameInput;
