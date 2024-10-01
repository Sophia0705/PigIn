import React from 'react';
import { CryptoItemData } from '../../interfaces/CryptoInterface';

interface CryptoDetailInfoProps {
  cryptoData: CryptoItemData;
}

const CryptoDetailInfo: React.FC<CryptoDetailInfoProps> = ({ cryptoData }) => {
  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      <div>
        {[
          { label: '시가', value: cryptoData.open },
          { label: '종가', value: cryptoData.close },
          { label: '고가', value: cryptoData.high },
          { label: '저가', value: cryptoData.low },
          { label: '전일 대비 증감액', value: cryptoData.priceChange },
          { label: '거래량', value: cryptoData.volume },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between font-extrabold text-gray-700 mb-2 border-b border-gray-300 pb-2"
          >
            <span>{item.label}</span>
            <span>
              {item.label === '거래량'
                ? `${Number(item.value).toLocaleString()} 회`
                : `${Number(item.value).toLocaleString()} 원`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoDetailInfo;
