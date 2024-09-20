import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // 2초 후 자동으로 메인 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/investment');
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  // 클릭 시 메인 페이지로 이동
  const handleTouch = () => {
    navigate('/main');
  };

  return (
    <div
      onClick={handleTouch} // 클릭 이벤트 핸들러 추가
      className="relative flex justify-center items-center h-screen bg-gray-100 overflow-hidden"
    >
      {/* 전체 화면을 덮는 비디오 */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="coin_rain.mp4" type="video/mp4" />
      </video>

      <div className="relative flex flex-col items-center justify-center w-full h-full z-10">
        {/* 애니메이션 콘텐츠 */}
        <header className="flex items-center space-x-0">
          {/* Pig와 In 텍스트 크기와 애니메이션 적용 */}
          <span
            style={{ animation: `moveLeftExpand 2s infinite` }}
            className="text-[90px] md:text-[180px] lg:text-[240px] font-bold text-gray-800"
          >
            Pig
          </span>
          <span
            style={{ animation: 'moveRightExpand 2s infinite' }}
            className="text-[90px] md:text-[180px] lg:text-[240px] font-bold text-gray-800"
          >
            In
          </span>
        </header>
        <h1>자동 저축 투자 플랫폼</h1>
        {/* 돼지 저금통 이미지 */}
        <img
          src="../src/user/assets/pig.png"
          alt="Piggy Bank"
          className="mt-4 md:mt-6 lg:mt-8 w-[600px] md:w-[960px] lg:w-[1440px] h-auto z-20 block mx-auto"
        />

        {/* 동전 이미지 */}
        <img
          src="../src/user/assets/coin.png"
          alt="Coin"
          style={{ animation: 'dropCoin 2s infinite' }}
          className="absolute top-[100px] left-[180px] w-36 md:w-42 lg:w-48 h-36 md:h-42 lg:h-48 z-30"
        />
      </div>
    </div>
  );
};

export default LandingPage;
