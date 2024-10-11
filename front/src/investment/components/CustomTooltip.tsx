import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#fff',
          padding: '5px',
          border: '1px solid #ccc',
        }}
      >
        <p className="label">{label}</p> {/* 날짜 */}
        <p className="price">{payload[0].value.toLocaleString()} 원</p>{' '}
        {/* 가격 */}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
