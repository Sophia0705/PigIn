import React from 'react';
import { GoldItemData } from '../../interfaces/GoldInterface';

interface GoldDetailInfoProps {
  goldData: GoldItemData;
}

const GoldDetailInfo: React.FC<GoldDetailInfoProps> = ({ goldData }) => {
  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      <div>
        {[
          {
            label: '현재가',
            value: Number(goldData.close).toLocaleString() + '원',
          },
          {
            label: '최고가',
            value: Number(goldData.high).toLocaleString() + '원',
          },
          {
            label: '최저가',
            value: Number(goldData.low).toLocaleString() + '원',
          },
          {
            label: '시가',
            value: Number(goldData.open).toLocaleString() + '원',
          },
          {
            label: '종가',
            value: Number(goldData.close).toLocaleString() + '원',
          },
          {
            label: '거래량',
            value: Number(goldData.tradeAmount).toLocaleString() + 'kg',
          },
          {
            label: '전일 대비 증감액',
            value: Number(goldData.vsYesterday).toLocaleString() + '원',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between font-extrabold text-gray-700 mb-2 border-b border-gray-300 pb-2"
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldDetailInfo;
