// CryptoList
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import CryptoData from '../data/CryptoData';

interface CryptoListProps {
  limit?: number;
  showTitle?: boolean;
}

const CryptoList: React.FC<CryptoListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate();
  const displayData = limit ? CryptoData.slice(0, limit) : CryptoData;

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mt-0 mb-0">
      {' '}
      {/* 고정된 가로 크기 */}
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">
            가상화폐
          </h2>
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-4 py-1 hover:bg-gray-200"
              onClick={() => navigate('/crypto-favorites')}
            >
              더 보기
            </button>
          )}
        </div>
      )}
      <div className="p-0">
        {displayData.map((crypto) => (
          <CryptoItem
            key={crypto.symbol}
            name={crypto.name}
            symbol={crypto.symbol}
            price={crypto.price}
            percentageChange={crypto.percentageChange}
            weeklyPrices={crypto.weeklyPrices}
          />
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
