import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { FaPiggyBank, FaPlusCircle } from 'react-icons/fa';
import { useMemberStore } from '../../store/memberStore'; // Zustand store 가져오기

const AccountSlider: React.FC = () => {
  const { openSpendingAccountRegisterModal } = useMemberStore(); // 소비 계좌 등록 모달 열기 함수 가져오기

  return (
    <div className="w-[400px] h-[350px] mx-auto mt-0 relative">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        계좌 정보
      </h2>

      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        modules={[Pagination, Navigation]}
        className="relative rounded-lg shadow-lg"
        style={{ paddingLeft: '30px', paddingRight: '30px' }}
      >
        {/* 첫 번째 슬라이드 (투자 계좌) */}
        <SwiperSlide>
          <div className="p-8 bg-green-100 rounded-lg shadow-md w-[80vw] h-[28vh] flex flex-col items-center justify-center">
            <FaPiggyBank className="text-green-600 text-5xl mb-4" />
            <h2 className="text-xl font-bold mb-1 text-green-800">투자 계좌</h2>
            <p className="text-gray-700 text-base">싸피은행</p>
            <p className="text-gray-700 text-base mb-2">
              계좌번호: 123-4567-8901
            </p>
            <p className="text-gray-700 text-lg font-semibold">잔액: 3,620원</p>
          </div>
        </SwiperSlide>

        {/* 두 번째 슬라이드 (소비 계좌 등록) */}
        <SwiperSlide>
          <div
            className="p-8 bg-red-100 rounded-lg shadow-md w-[80vw] h-[28vh] flex flex-col items-center justify-center"
            onClick={openSpendingAccountRegisterModal} // Zustand의 전역 상태로 모달을 여는 함수 호출
          >
            <FaPlusCircle className="text-red-600 text-5xl mb-4" />
            <h2 className="text-xl font-bold text-red-800">소비 계좌 등록</h2>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AccountSlider;
