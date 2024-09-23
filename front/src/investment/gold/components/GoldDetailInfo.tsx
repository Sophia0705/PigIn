import React from "react";

interface GoldDetailInfoProps {
  latestValue: number;
}

const GoldDetailInfo: React.FC<GoldDetailInfoProps> = ({ latestValue }) => {
  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      <div>
        {[
          { label: "현재가", value: latestValue.toLocaleString() + "원" },
          {
            label: "최고가",
            value: (latestValue * 1.1).toLocaleString() + "원",
          },
          {
            label: "최저가",
            value: (latestValue * 0.9).toLocaleString() + "원",
          },
          { label: "거래량", value: "1,234kg" },
          { label: "시가총액", value: "5조원" },
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
