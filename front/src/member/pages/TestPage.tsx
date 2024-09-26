import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestPage: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL; // 환경 변수에서 BASE_URL 가져오기
  const [healthStatus, setHealthStatus] = useState<string | null>(null); // 서버 응답 상태 저장용

  useEffect(() => {
    // API 호출을 위한 함수
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}health-check`);
        setHealthStatus(response.data); // 성공 시 서버에서 받은 데이터 저장
      } catch (error) {
        console.error('Error fetching health check:', error);
        setHealthStatus('Error'); // 실패 시 'Error'로 상태 설정
      }
    };

    checkHealth(); // 컴포넌트가 렌더링될 때 API 호출
  }, [BASE_URL]);

  return (
    <div>
      <h1>Health Check</h1>
      <p>Status: {healthStatus}</p> {/* 서버의 응답 상태를 출력 */}
    </div>
  );
};

export default TestPage;
