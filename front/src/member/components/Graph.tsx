import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Graph 컴포넌트의 props 타입 정의. 가격 데이터 배열을 받음.
interface GraphProps {
  data: number[]; // 주간 주식 가격 데이터 배열
  color: string; // 그래프 색상
}

// 주식의 주간 가격 변동을 시각화하는 그래프 컴포넌트
const Graph: React.FC<GraphProps> = ({ data, color }) => {
  // 고유한 ID를 생성하기 위해 그래프 데이터의 길이 또는 고유 값을 사용
  const gradientId = `colorStock-${Math.random()}`;

  // 데이터 배열을 차트 데이터 형식으로 변환
  const chartData = data.map((value, index) => ({
    name: `Day ${index + 1}`, // X축의 날짜 (Day 1, Day 2 등)
    value, // Y축의 주식 가격
  }));

  // Y축의 최소값과 최대값을 계산
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={chartData}>
        <defs>
          {/* 각 그래프에 고유한 그라데이션 ID를 설정 */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {/* 선과 동일한 색상의 그라데이션 적용 */}
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide />
        <YAxis domain={[minValue - padding, maxValue + padding]} hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color} // 선의 색깔을 prop으로 받은 색상으로 설정
          fill={`url(#${gradientId})`} // 동적으로 생성된 그라데이션 ID 사용
          strokeWidth={2}
          dot={false}
          fillOpacity={0.3} // 그라데이션 투명도 설정
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Graph;
