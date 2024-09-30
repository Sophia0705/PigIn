import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleTouch = () => {
    navigate('/main');
  };

  return (
    <div
      onClick={handleTouch}
      className="relative flex flex-col justify-center items-center min-h-screen bg-gray-100 overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 overflow-hidden">
        {/* 비디오 배경 */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ minHeight: '100vh' }}
        >
          <source src="coin_rain.mp4" type="video/mp4" />
        </video>

        <div className="relative flex flex-col items-center justify-center w-full h-full z-10">
          {/* 헤더 텍스트 */}
          <header className="flex items-center space-x-0 mb-4">
            <span className="text-7xl font-bold text-gray-800 animate-moveLeftExpand">
              Pig
            </span>
            <span className="text-7xl font-bold text-gray-800 animate-moveRightExpand">
              In
            </span>
          </header>
          <h1 className="text-2xl mb-6 text-gray-800">자동 저축 투자 플랫폼</h1>

          {/* 돼지 저금통 이미지 */}
          <img
            src="/pig.png"
            alt="Piggy Bank"
            className="w-7/8 h-auto z-20 block mx-auto"
          />

          {/* 동전 이미지 */}
          <img
            src="/coin.png"
            alt="Coin"
            className="absolute top-1/4 left-2/4 w-20 h-20 z-30 animate-dropCoin"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
