import React from 'react';
import { StockItemData } from '../../interfaces/StockInterface';

interface StockDetailInfoProps {
  stockData: StockItemData;
}

const StockDetailInfo: React.FC<StockDetailInfoProps> = ({ stockData }) => {
  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      <div>
        {[
          { label: '전일', value: stockData.stck_prdy_clpr },
          { label: '시가', value: stockData.stck_oprc },
          { label: '고가', value: stockData.stck_hgpr },
          { label: '저가', value: stockData.stck_lwpr },
          { label: '거래량', value: stockData.acml_vol },
          { label: '52주 최고', value: stockData.stck_mxpr },
          { label: '52주 최저', value: stockData.stck_llam },
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

export default StockDetailInfo;
