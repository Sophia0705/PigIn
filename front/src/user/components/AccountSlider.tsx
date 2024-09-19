import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper 기본 CSS (슬라이드 기능에 필요한 기본 스타일)
import 'swiper/css/pagination'; // Pagination 모듈의 CSS (페이지 네이션 스타일)
import 'swiper/css/navigation'; // Navigation 모듈의 CSS (네비게이션 버튼 스타일)
import { Pagination, Navigation } from 'swiper/modules'; // Swiper 모듈에서 Pagination과 Navigation 불러오기

// AccountSlider 컴포넌트 정의
const AccountSlider: React.FC = () => {
  return (
    // 슬라이더를 담을 컨테이너 div. 고정 크기로 설정
    <div className="w-[400px] h-[300px] mx-auto mt-10 relative">
      {/*
        w-[400px]: 너비를 400px로 고정
        h-[300px]: 높이를 300px로 고정
        mx-auto: 수평 중앙 정렬
        mt-10: 상단에 10 단위의 마진 추가 (Tailwind의 spacing scale, 약 2.5rem)
        relative: 내부 절대 위치 요소의 기준으로 설정
      */}

      {/* Swiper 컴포넌트: 슬라이드 기능을 제공 */}
      <Swiper
        spaceBetween={10} // 슬라이드 사이의 간격을 10px로 설정
        slidesPerView={1} // 한 번에 보여줄 슬라이드의 개수를 1개로 설정
        pagination={{ clickable: true }} // 페이지 네이션 활성화 및 클릭 가능 설정
        navigation // 이전/다음 네비게이션 버튼 활성화
        modules={[Pagination, Navigation]} // Swiper에서 사용하는 모듈 지정
        className="relative rounded-lg shadow-lg"
        style={{ paddingLeft: '30px', paddingRight: '30px' }} // 화살표를 슬라이드 외부에 위치시키기 위해 여백 추가
      >
        {/*
          relative: Swiper 컴포넌트를 위치 기준으로 설정
          rounded-lg: 슬라이더의 모서리를 둥글게 (large: 약 0.5rem)
          shadow-lg: 큰 그림자 효과를 적용하여 입체감 제공
          다른 rounded 옵션들:
            - rounded-none: 둥글지 않음
            - rounded-sm: 작은 둥근 모서리
            - rounded-md: 중간 둥근 모서리 (default)
            - rounded-full: 완전히 둥글게 (완전한 원 모양)
            - rounded-xl, rounded-2xl 등으로 더 크게 설정 가능
        */}

        {/* 첫 번째 슬라이드 */}
        <SwiperSlide>
          <div className="p-16 bg-white rounded-lg shadow-md w-full h-full">
            {/*
              p-4: 모든 면에 4 단위의 패딩 추가 (약 1rem)
              bg-white: 배경색을 흰색으로 설정
              rounded-lg: 모서리를 둥글게 (large)
              shadow-md: 중간 크기의 그림자 효과 추가
              w-full: 너비를 부모 요소에 맞게 100% 설정
              h-full: 높이를 부모 요소에 맞게 100% 설정
              다른 패딩 옵션들:
                - p-0: 패딩 없음
                - p-1, p-2 ... p-12: 패딩 크기 증가 (각각 약 0.25rem, 0.5rem, ...)
                - px-4: 좌우 패딩만 적용
                - py-4: 상하 패딩만 적용
            */}
            <h2 className="text-xl font-bold mb-2">Account 1</h2>
            {/*
              text-xl: 텍스트 크기를 extra large로 설정 (약 1.25rem)
              font-bold: 텍스트를 굵게 표시
              mb-2: 하단에 2 단위의 마진 추가 (약 0.5rem)
              다른 텍스트 크기 옵션:
                - text-sm: 작은 텍스트
                - text-base: 기본 텍스트 크기
                - text-2xl, text-3xl: 더 큰 텍스트 크기
                - text-xs: 매우 작은 텍스트
              다른 폰트 굵기 옵션:
                - font-normal: 기본 굵기
                - font-semibold: 중간 굵기
                - font-thin: 얇은 텍스트
            */}
            <p className="text-gray-700">Balance: $5,000</p>
            {/*
              text-gray-700: 텍스트 색상을 회색 계열 중간 단계로 설정
              다른 색상 옵션들:
                - text-red-500: 빨간색 텍스트
                - text-blue-500: 파란색 텍스트
                - text-green-500: 녹색 텍스트
                - text-black: 검은색 텍스트
                - text-white: 흰색 텍스트
            */}
          </div>
        </SwiperSlide>

        {/* 두 번째 슬라이드 */}
        <SwiperSlide>
          <div className="p-16 bg-white rounded-lg shadow-md w-full h-full">
            <h2 className="text-xl font-bold mb-2">Account 2</h2>
            <p className="text-gray-700">Balance: $12,000</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AccountSlider;
