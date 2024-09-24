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
  // 그라데이션 효과를 각 그래프마다 고유하게 적용하기 위해 사용
  const gradientId = `colorStock-${Math.random()}`;

  // 데이터 배열을 Recharts에서 사용할 수 있는 차트 데이터 형식으로 변환
  const chartData = data.map((value, index) => ({
    name: `Day ${index + 1}`, // X축의 레이블로 사용할 날짜
    value, // Y축에 표시할 주식 가격 데이터
  }));

  // Y축의 최소값과 최대값을 계산하여 차트의 범위를 설정
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const padding = (maxValue - minValue) * 0.1; // 상하 여백을 주기 위한 패딩

  return (
    // ResponsiveContainer로 차트가 부모 요소에 맞게 크기를 조절
    <ResponsiveContainer width="100%" height={50}>
      {/* AreaChart 컴포넌트로 데이터를 전달 */}
      <AreaChart data={chartData}>
        <defs>
          {/* 그라데이션을 설정. 각 차트마다 고유한 ID를 사용해 적용 */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {/* 그라데이션의 시작 색상을 전달받은 color 값으로 설정 */}
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            {/* 그라데이션의 끝부분은 동일한 색상이나 투명도 증가 */}
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* X축 설정 (숨김 처리) */}
        <XAxis dataKey="name" hide />
        {/* Y축 설정. 최소값과 최대값에 상하 패딩을 더하여 영역을 표시 */}
        <YAxis domain={[minValue - padding, maxValue + padding]} hide />
        {/* 영역 그래프(Area)를 렌더링 */}
        <Area
          type="monotone" // 선을 부드러운 곡선 형태로 설정
          dataKey="value" // 데이터를 표현할 key
          stroke={color} // 선의 색상을 전달받은 color로 설정
          fill={`url(#${gradientId})`} // 그라데이션을 영역에 채워넣음
          strokeWidth={2} // 선의 두께 설정
          dot={false} // 데이터 포인트(dot)를 표시하지 않음
          fillOpacity={0.3} // 그라데이션 투명도 설정
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Graph;
