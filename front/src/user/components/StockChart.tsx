import React from 'react';
import {
  LineChart, // 선형 그래프를 그리는 컴포넌트
  Line, // 실제 선을 그리는 컴포넌트
  XAxis, // X축을 정의하는 컴포넌트
  YAxis, // Y축을 정의하는 컴포넌트
  Tooltip, // 마우스 호버 시 값이 표시되도록 해주는 컴포넌트
  ResponsiveContainer, // 그래프가 화면 크기에 맞게 반응형으로 동작하도록 설정하는 컴포넌트
} from 'recharts';

// 차트에 사용할 데이터를 정의하는 타입. 데이터에는 날짜(이름)와 가격이 포함됨.
interface ChartData {
  name: string; // X축에 표시할 날짜 정보 (Day 1, Day 2 등)
  price: number; // Y축에 표시할 가격 정보 (예: 67500 KRW)
}

// StockChart 컴포넌트의 props 타입 정의. 'chartData'는 주식의 주간 가격 데이터가 배열로 들어감.
interface StockChartProps {
  chartData: ChartData[]; // 차트에 그려질 데이터 배열. 각 데이터는 날짜와 가격으로 구성됨.
}

// 선형 차트(가격 변동 차트)를 그리는 StockChart 컴포넌트
const StockChart: React.FC<StockChartProps> = ({ chartData }) => {
  return (
    // 차트의 컨테이너를 반응형으로 설정. 화면 크기에 따라 자동으로 크기가 변함.
    <ResponsiveContainer width="100%" height={50}>
      {/* LineChart는 X축과 Y축에 대한 선형 데이터를 그리는 그래프 컴포넌트 */}
      <LineChart data={chartData}>
        {/* XAxis는 데이터를 기준으로 X축에 Day 1, Day 2와 같은 값을 숨겨서 표시 */}
        <XAxis dataKey="name" hide />
        {/* YAxis는 데이터를 기준으로 Y축에 가격을 숨겨서 표시 */}
        <YAxis hide />
        {/* Tooltip은 마우스가 선 위에 위치할 때 가격을 보여주는 역할 */}
        <Tooltip />
        {/* Line은 실제로 선을 그리는 컴포넌트. type="monotone"은 선의 형태를 부드럽게 만듦. */}
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
