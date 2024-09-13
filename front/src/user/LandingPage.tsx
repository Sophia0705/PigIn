import React, { useEffect, useRef } from 'react';

const LandingPage: React.FC = () => {
  // useRef로 요소 참조하기
  const coinRef = useRef<HTMLImageElement>(null); // 동전 이미지 참조
  const pigTextRef = useRef<HTMLSpanElement>(null); // Pig 텍스트 참조
  const inTextRef = useRef<HTMLSpanElement>(null); // In 텍스트 참조

  useEffect(() => {
    // 동전과 텍스트 애니메이션을 동시에 시작
    if (coinRef.current && pigTextRef.current && inTextRef.current) {
      coinRef.current.style.animation = 'dropCoin 2s infinite'; // 동전이 반복적으로 떨어짐
      pigTextRef.current.style.animation = 'moveLeftExpand 2s infinite'; // Pig 텍스트 벌어짐 애니메이션
      inTextRef.current.style.animation = 'moveRightExpand 2s infinite'; // In 텍스트 벌어짐 애니메이션
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* 반응형으로 크기를 조정 */}
      <div
        className="relative flex flex-col items-center justify-center w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-full max-h-screen overflow-hidden"
      >
        {/* 비디오 배경 */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/coin_rain.mp4" type="video/mp4" />
        </video>

        {/* 애니메이션 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <header className="flex items-center space-x-0">
            {/* Pig와 In 텍스트 분리 */}
            <span
              ref={pigTextRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 transition-transform"
              id="pig-text"
            >
              Pig
            </span>
            <span
              ref={inTextRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 transition-transform"
              id="in-text"
            >
              In
            </span>
          </header>

          {/* 돼지 저금통 이미지 */}
          <img
            src="/pig.png" // 돼지 저금통 이미지 파일 경로
            alt="Piggy Bank"
            className="mt-4 md:mt-6 lg:mt-8 w-[200px] md:w-[320px] lg:w-[480px] h-auto z-20"
            id="piggy-bank"
          />

          {/* 동전 이미지 */}
          <img
            ref={coinRef}
            src="/coin.png" // 동전 이미지 파일 경로
            alt="Coin"
            className="absolute top-0 w-12 md:w-14 lg:w-16 h-12 md:h-14 lg:h-16 transition-transform z-5"
            id="falling-coin"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
