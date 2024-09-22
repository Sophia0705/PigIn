// StockList
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StockItem from './StockItem';
import StockData from '../data/StockData';

interface StockListProps {
  limit?: number;
  showTitle?: boolean;
}

const StockList: React.FC<StockListProps> = ({ limit, showTitle = true }) => {
  const navigate = useNavigate();
  const displayData = limit ? StockData.slice(0, limit) : StockData;

  return (
    <div className="bg-white rounded-lg shadow-md w-[352px] mx-auto p-4 mt-0 mb-0">
      {' '}
      {/* 고정된 가로 크기 */}
      {showTitle && (
        <div className="flex justify-between items-center mb-0 px-0">
          <h2 className="text-3xl pl-0 pb-2 font-bold text-gray-900">주식</h2>
          {limit && (
            <button
              className="text-sm text-gray-500 border border-gray-300 rounded-full pt-0 px-4 py-1 hover:bg-gray-200"
              onClick={() => navigate('/stock-favorites')}
            >
              더 보기
            </button>
          )}
        </div>
      )}
      <div className="p-0">
        {displayData.map((stock) => (
          <StockItem
            key={stock.stck_shrn_iscd}
            name={stock.hts_kor_isnm}
            code={stock.stck_shrn_iscd}
            price={stock.stck_prpr}
            percentageChange={stock.prdy_ctrt}
            weeklyPrices={stock.weeklyPrices}
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;
