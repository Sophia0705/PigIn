import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
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
          {/* Pig와 In 텍스트 크기를 크게 조정 */}
          <span className="text-[90px] md:text-[180px] lg:text-[240px] font-bold text-gray-800 animate-moveLeftExpand">
            Pig
          </span>
          <span className="text-[90px] md:text-[180px] lg:text-[240px] font-bold text-gray-800 animate-moveRightExpand">
            In
          </span>
        </header>

        {/* 돼지 저금통 이미지 */}
        <img
          src="../src/member/assets/pig.png"
          alt="Piggy Bank"
          className="mt-4 md:mt-6 lg:mt-8 w-[600px] md:w-[960px] lg:w-[1440px] h-auto z-20 block mx-auto"
        />

        {/* 동전 이미지 */}
        <img
          src="../src/member/assets/coin.png"
          alt="Coin"
          className="absolute top-[100px] left-[180px] w-36 md:w-42 lg:w-48 h-36 md:h-42 lg:h-48 animate-dropCoin z-30"
        />
      </div>
    </div>
  );
};

export default LandingPage;
