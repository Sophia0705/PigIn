import React, { useEffect, useCallback } from 'react';
import { CgClose } from 'react-icons/cg';

interface GoldPurchaseModalProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  goldPrice: number;
}

const GoldPurchaseModal: React.FC<GoldPurchaseModalProps> = ({
  inputValue,
  setInputValue,
  onClose,
  goldPrice,
}) => {
  const handleKeypadClick = (number: string) => {
    setInputValue((prev) => {
      if (prev.length < 6) {
        return prev + number;
      } else {
        return prev;
      }
    });
  };

  const handleBackspace = useCallback(() => {
    setInputValue((prev) => prev.slice(0, -1));
  }, [setInputValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBackspace]);

  const inputAmount = parseFloat(inputValue) || 0;
  const percentage = ((inputAmount / goldPrice) * 100).toFixed(2);

  return (
    <div className="modal-content fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full h-3/4 rounded-t-3xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black flex justify-center">
            얼마를 매수하시겠어요?
          </h1>
          <div onClick={onClose} className="text-black">
            <CgClose size={24} />
          </div>
        </div>

        <div className="text-lg text-center text-black mb-4">
          금 현재가 : {goldPrice.toLocaleString()}원
        </div>

        <div className="relative flex justify-center mb-6">
          <input
            type="text"
            value={inputValue}
            readOnly
            className={`bg-transparent text-center text-black text-3xl w-3/4 p-2 transition-all ${
              inputValue ? 'border-b border-black' : ''
            }`}
          />
          <div
            className={`absolute right-4 mt-3 flex items-center space-x-1 ${
              inputValue ? 'text-black' : ''
            }`}
          >
            <span className="text-xl">원 ({percentage}%)</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {[500, 1000, 3000, 5000].map((amount) => (
            <button
              key={amount}
              className="bg-customDarkGreen p-2 text-sm text-white rounded-full transition-colors"
              onClick={() =>
                setInputValue((prev) =>
                  (parseInt(prev || '0') + amount).toString()
                )
              }
            >
              +{amount.toLocaleString()}원
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 justify-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              className="bg-transparent text-black text-2xl p-4 rounded-lg transition-colors w-full h-20"
              onClick={() => handleKeypadClick(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="bg-transparent text-black text-2xl p-4 rounded-lg transition-colors w-full h-20 col-span-3"
            onClick={() => handleKeypadClick('0')}
          >
            0
          </button>
        </div>

        <button className="w-full bg-green-500 text-white py-3 rounded-md mt-1">
          매수하기
        </button>
      </div>
    </div>
  );
};

export default GoldPurchaseModal;
