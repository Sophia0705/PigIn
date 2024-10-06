import React from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기

const SavingRateInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // Zustand에서 저축률 상태 및 함수 가져오기
  const savingRate = formData.savingRate; // 저축률 상태 가져오기

  const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData({ savingRate: value }); // 저축률 상태 변경
  };

  return (
    <div className="mt-4">
      <label className="text-gray-700 text-sm block mb-2">저축률 설정</label>
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={savingRate}
          onChange={handleSavingRateChange}
          className="w-full focus:outline-none focus:ring-2 focus:ring-customAqua"
          style={{
            // 슬라이더 트랙 (왼쪽은 customAqua, 오른쪽은 기본 회색)
            WebkitAppearance: 'none',
            appearance: 'none',
            height: '6px',
            borderRadius: '5px',
            background: `linear-gradient(to right, #9CF8E1 ${savingRate * 10}%, #e0e0e0 ${savingRate * 10}%)`,
            outline: 'none',
            cursor: 'pointer',
          }}
        />
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          value={savingRate}
          onChange={handleSavingRateChange}
          className="w-7 p-1 text-right border-none border-gray-300 rounded"
          disabled
        />
        <span className="!ml-0">%</span>
      </div>
      <style>
        {`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #9CF8E1; /* 포인터 색상을 customAqua로 변경 */
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #9CF8E1; /* 포인터 색상을 customAqua로 변경 */
          cursor: pointer;
        }
        `}
      </style>
    </div>
  );
};

export default SavingRateInput;
