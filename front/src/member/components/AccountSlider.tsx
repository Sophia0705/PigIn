import React, { useState, useRef } from "react";

export const AccountSlider: React.FC = () => {
  const [currentAccount, setCurrentAccount] = useState(0); // 현재 보고 있는 계좌
  const accounts = [
    { id: 1, name: "계좌 1", info: "계좌 정보 1" },
    { id: 2, name: "계좌 2", info: "계좌 정보 2" },
  ];

  const sliderRef = useRef<HTMLDivElement>(null); // 슬라이더의 참조
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartPosition(clientX);
    setPrevTranslate(currentTranslate);
  };

  const handleDragMove = (clientX: number) => {
    if (isDragging) {
      const newTranslate = prevTranslate + (clientX - startPosition);

      // 첫 번째 계좌일 때는 오른쪽(다음 계좌)로만, 두 번째 계좌일 때는 왼쪽(이전 계좌)으로만 슬라이드 허용
      if (
        (currentAccount === 0 && clientX < startPosition) ||
        (currentAccount === 1 && clientX > startPosition)
      ) {
        setCurrentTranslate(newTranslate);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    const movedBy = currentTranslate - prevTranslate;

    // 드래그 방향에 따라 슬라이드 이동 여부 결정
    if (movedBy < -50 && currentAccount === 0) {
      setCurrentAccount(1); // 다음 계좌
    } else if (movedBy > 50 && currentAccount === 1) {
      setCurrentAccount(0); // 이전 계좌
    }

    // 드래그 후 원래 자리로 돌아오도록 설정
    setCurrentTranslate(0);
  };

  return (
    <div>
      {/* 계좌 정보 슬라이드 */}
      <div
        className="relative w-80 h-40 overflow-hidden"
        ref={sliderRef}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentAccount * 80}%) translateX(${currentTranslate}px)`,
          }}
        >
          {accounts.map((account, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-72 h-40 mx-2 bg-green-500 rounded-lg p-6 text-white text-center ${
                index === currentAccount ? "scale-100" : "scale-90"
              } transition-transform duration-500 ease-in-out`}
            >
              <p>{account.name}</p>
              <p className="mt-2">{account.info}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination (점 2개) - 가운데 정렬 */}
      <div className="flex justify-center space-x-2 mt-4">
        {accounts.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentAccount ? "bg-blue-500" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};
