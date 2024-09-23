// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Tailwind가 스타일을 적용할 파일 경로
  theme: {
    extend: {
      colors: {
        customAqua: '#9CF8E1', // 커스텀 색상 추가
        customDarkGreen: '#1F3F42', // 커스텀 색상 추가
      },
      keyframes: {
        // 동전이 떨어지는 애니메이션
        dropCoin: {
          '0%': { transform: 'translateY(-100px)' }, // 시작 위치
          '100%': { transform: 'translateY(275px)' }, // 최종 위치
        },
        // Pig 텍스트가 왼쪽으로 벌어지는 애니메이션
        moveLeftExpand: {
          '0%': { transform: 'translateX(0)' }, // 텍스트가 붙어 있음
          '100%': { transform: 'translateX(-50px)' }, // 텍스트가 왼쪽으로 벌어짐
        },
        // In 텍스트가 오른쪽으로 벌어지는 애니메이션
        moveRightExpand: {
          '0%': { transform: 'translateX(0)' }, // 텍스트가 붙어 있음
          '100%': { transform: 'translateX(70px)' }, // 텍스트가 오른쪽으로 벌어짐
        },
        // 모달창 아래에서 위로 올라오는 애니메이션
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'dropCoin': 'dropCoin 2s infinite', // 동전이 떨어지는 애니메이션
        'moveLeftExpand': 'moveLeftExpand 2s infinite', // Pig 텍스트 벌어짐 애니메이션
        'moveRightExpand': 'moveRightExpand 2s infinite', // In 텍스트 벌어짐 애니메이션
        'slide-up': 'slideUp 0.5s ease-out forwards', // 모달창 아래에서 위로 올라오는 애니메이션
      },
    },
  },
  plugins: [],
};
