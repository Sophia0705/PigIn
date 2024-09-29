import React from 'react';
import { useStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기

const SavingRateInput: React.FC = () => {
  const { formData, setFormData } = useStore(); // Zustand에서 저축률 상태 및 함수 가져오기
  const savingRate = formData.savingRate; // 저축률 상태 가져오기

  const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ savingRate: value }); // 저축률 상태 변경
  };

  return (
    <div className="mt-4">
      <label className="text-gray-700 text-sm block mb-2">저축률 설정</label>
      <div className="flex items-center space-x-4 mt-2">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={savingRate}
          onChange={handleSavingRateChange}
          className="w-full"
        />
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          value={savingRate}
          onChange={handleSavingRateChange}
          className="w-12 p-1 text-right border-none border-gray-300 rounded"
          disabled
        />
        <span>%</span>
      </div>
    </div>
  );
};

export default SavingRateInput;
