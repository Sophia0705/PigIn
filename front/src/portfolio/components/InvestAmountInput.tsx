import { useState } from 'react';
import { Edit } from 'lucide-react';

interface InvestmentAmountInputProps {
  localInvestmentAmount: string;
  setLocalInvestmentAmount: (amount: string) => void;
}

const InvestmentAmountInput: React.FC<InvestmentAmountInputProps> = ({
  localInvestmentAmount,
  setLocalInvestmentAmount,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInvestmentAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInvestmentAmount(value);
      setError('');
    } else {
      setError('숫자만 입력해주세요.');
    }
  };

  return (
    <>
      {showInput ? (
        <div className="flex flex-col mb-6 bg-white rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-grow mr-4">
              <p className="p-2 text-black text-lg">투자가능금액 : xxxx원</p>
              <input
                type="text"
                value={localInvestmentAmount}
                onChange={handleInvestmentAmountChange}
                className={`w-full bg-transparent border-b ${
                  error ? 'border-red-500' : 'border-customAqua'
                } p-2 text-xl text-black placeholder-gray-500 placeholder:text-base focus:outline-none`}
                placeholder="자동 투자하실 금액을 입력해주세요"
              />
            </div>
            <button
              onClick={() => setShowInput(false)}
              className="bg-customAqua text-customDarkGreen p-3 rounded text-lg my-auto whitespace-nowrap self-start"
            >
              투자
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}
        </div>
      ) : (
        <div className="mb-5 text-center">
          <p className="text-lg mb-2">자동 투자금액 설정금액</p>
          <div className="flex items-center justify-center">
            <p className="text-3xl font-bold mr-2">
              {Number(localInvestmentAmount).toLocaleString()}원
            </p>
            <Edit onClick={() => setShowInput(true)} />
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentAmountInput;
