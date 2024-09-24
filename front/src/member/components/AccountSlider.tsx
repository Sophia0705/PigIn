import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper의 기본 CSS를 불러옴
import 'swiper/css/pagination'; // Swiper의 Pagination(페이지 네이션) 모듈 CSS를 불러옴
import 'swiper/css/navigation'; // Swiper의 Navigation(네비게이션) 모듈 CSS를 불러옴
import { Pagination, Navigation } from 'swiper/modules'; // Swiper의 Pagination과 Navigation 모듈을 사용
import { FaPiggyBank, FaShoppingCart } from 'react-icons/fa'; // 아이콘을 사용하기 위해 react-icons에서 불러옴

// AccountSlider 컴포넌트 정의
const AccountSlider: React.FC = () => {
  return (
    <div className="w-[400px] h-[350px] mx-auto mt-0 relative">
      {/* "계좌 정보"라는 제목을 중앙에 표시 */}
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        계좌 정보
      </h2>

      {/* Swiper 슬라이더 사용 */}
      <div>
        <Swiper
          spaceBetween={10} // 슬라이드 간의 간격을 10px로 설정
          slidesPerView={1} // 한 번에 1개의 슬라이드를 보여줌
          pagination={{ clickable: true }} // 페이지 네이션을 활성화하고 클릭 가능하게 설정
          navigation // 네비게이션 버튼 활성화
          modules={[Pagination, Navigation]} // Swiper 모듈에서 Pagination과 Navigation 사용
          className="relative rounded-lg shadow-lg"
          style={{ paddingLeft: '30px', paddingRight: '30px' }} // 슬라이드 좌우에 30px의 패딩 추가
        >
          {/* 첫 번째 슬라이드 (투자 계좌) */}
          <SwiperSlide>
            <div className="p-8 bg-green-100 rounded-lg shadow-md w-full h-full flex flex-col items-center">
              {/* 투자 계좌를 나타내는 아이콘 */}
              <FaPiggyBank className="text-green-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold mb-1 text-green-800">
                투자 계좌
              </h2>
              {/* 은행 이름과 계좌 번호 표시 */}
              <p className="text-gray-700 text-base">싸피은행</p>
              <p className="text-gray-700 text-base mb-2">{`계좌번호: 123-4567-8901`}</p>
              {/* 계좌 잔액 표시 */}
              <p className="text-gray-700 text-lg font-semibold">
                잔액: 3,620원
              </p>
            </div>
          </SwiperSlide>

          {/* 두 번째 슬라이드 (소비 계좌) */}
          <SwiperSlide>
            <div className="p-8 bg-red-100 rounded-lg shadow-md w-full h-full flex flex-col items-center">
              {/* 소비 계좌를 나타내는 아이콘 */}
              <FaShoppingCart className="text-red-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold mb-1 text-red-800">소비 계좌</h2>
              {/* 은행 이름과 계좌 번호 표시 */}
              <p className="text-gray-700 text-base">싸피은행</p>
              <p className="text-gray-700 text-base mb-2">{`계좌번호: 987-6543-2101`}</p>
              {/* 계좌 잔액 표시 */}
              <p className="text-gray-700 text-lg font-semibold">
                잔액: 920,400원
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default AccountSlider;
