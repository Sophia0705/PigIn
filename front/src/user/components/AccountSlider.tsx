import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper 기본 CSS (슬라이드 기능에 필요한 기본 스타일)
import 'swiper/css/pagination'; // Pagination 모듈의 CSS (페이지 네이션 스타일)
import 'swiper/css/navigation'; // Navigation 모듈의 CSS (네비게이션 버튼 스타일)
import { Pagination, Navigation } from 'swiper/modules'; // Swiper 모듈에서 Pagination과 Navigation 불러오기
import { FaPiggyBank, FaShoppingCart } from 'react-icons/fa'; // 이모티콘 추가

// AccountSlider 컴포넌트 정의
const AccountSlider: React.FC = () => {
  return (
    <div className="w-[400px] h-[350px] mx-auto mt-0 relative">
      {/* "계좌 정보" 제목을 추가하고 중앙 정렬 */}
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        계좌 정보
      </h2>

      {/* Swiper 슬라이더 */}
      <div>
        <Swiper
          spaceBetween={10} // 슬라이드 사이의 간격을 10px로 설정
          slidesPerView={1} // 한 번에 보여줄 슬라이드의 개수를 1개로 설정
          pagination={{ clickable: true }} // 페이지 네이션 활성화 및 클릭 가능 설정
          navigation // 이전/다음 네비게이션 버튼 활성화
          modules={[Pagination, Navigation]} // Swiper에서 사용하는 모듈 지정
          className="relative rounded-lg shadow-lg"
          style={{ paddingLeft: '30px', paddingRight: '30px' }} // 화살표를 슬라이드 외부에 위치시키기 위해 여백 추가
        >
          {/* 첫 번째 슬라이드 (투자 계좌) */}
          <SwiperSlide>
            <div className="p-8 bg-green-100 rounded-lg shadow-md w-full h-full flex flex-col items-center">
              {/* 투자 이모티콘 */}
              <FaPiggyBank className="text-green-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold mb-1 text-green-800">
                투자 계좌
              </h2>
              {/* 은행 이름 및 계좌 번호 추가 */}
              <p className="text-gray-700 text-base">싸피은행</p>
              <p className="text-gray-700 text-base mb-2">{`계좌번호: 123-4567-8901`}</p>
              <p className="text-gray-700 text-lg font-semibold">
                잔액: 3,620원
              </p>
            </div>
          </SwiperSlide>

          {/* 두 번째 슬라이드 (소비 계좌) */}
          <SwiperSlide>
            <div className="p-8 bg-red-100 rounded-lg shadow-md w-full h-full flex flex-col items-center">
              {/* 소비 이모티콘 */}
              <FaShoppingCart className="text-red-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold mb-1 text-red-800">소비 계좌</h2>
              {/* 은행 이름 및 계좌 번호 추가 */}
              <p className="text-gray-700 text-base">싸피은행</p>
              <p className="text-gray-700 text-base mb-2">{`계좌번호: 987-6543-2101`}</p>
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
