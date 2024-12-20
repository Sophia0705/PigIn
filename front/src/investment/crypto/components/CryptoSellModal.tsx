import React, { useEffect, useCallback } from 'react';
import { CgClose } from 'react-icons/cg';

interface CryptoSellModalProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  cryptoName: string;
  cryptoPrice: number;
}

const CryptoSellModal: React.FC<CryptoSellModalProps> = ({
  inputValue,
  setInputValue,
  onClose,
  cryptoName,
  cryptoPrice,
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

  const handleAddAmount = (amount: number) => {
    setInputValue((prev) => {
      const newValue = parseInt(prev || '0') + amount;
      return newValue.toString();
    });
  };

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
  const percentage = ((inputAmount / cryptoPrice) * 100).toFixed(2);

  return (
    <div className="modal-content fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full h-3/4 rounded-t-3xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black flex justify-center">
            얼마를 매도하시겠어요?
          </h1>
          <div onClick={onClose} className="text-black">
            <CgClose size={24} />
          </div>
        </div>

        <div className="text-lg text-center text-black mb-4">
          {cryptoName} 현재 보유 : {cryptoPrice.toLocaleString()} 원
        </div>

        <div className="relative flex justify-center mb-6">
          <input
            type="text"
            value={inputValue}
            readOnly
            className={`bg-transparent text-center text-black text-3xl w-6/7 p-2 transition-all ${
              inputValue ? 'border-b border-black' : ''
            }`}
          />
          <div
            className={`absolute right-4 mt-4 flex items-center space-x-1 ${
              inputValue ? 'text-black' : ''
            }`}
          >
            <span className="text-xl">원 ({percentage}%)</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          {[
            { label: '+500원', value: 500 },
            { label: '+1000원', value: 1000 },
            { label: '+3000원', value: 3000 },
            { label: '+5000원', value: 5000 },
          ].map((button) => (
            <button
              key={button.value}
              className="bg-customDarkGreen p-2 text-sm text-white rounded-full transition-colors"
              onClick={() => handleAddAmount(button.value)}
            >
              {button.label}
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

        <div className="flex justify-center mt-1">
          <button className="bg-red-500 text-white text-lg py-3 rounded-lg w-full font-bold">
            매도하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CryptoSellModal;
