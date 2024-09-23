import React from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider'; // 기본 내보내기는 중괄호 없이 불러와야 함

const MyPage: React.FC = () => {
  return (
    <div className="w-[412px] h-[915px] flex flex-col items-center bg-customDarkGreen p-4">
      {/* MyPage 타이틀 */}
      <div className="w-full pt-0 flex justify-center">
        <h1 className="text-2xl font-bold text-white">My Page</h1>
      </div>

      {/* 회원 정보 컴포넌트 */}
      <div className="mt-4 w-full flex justify-center">
        <div className="flex flex-col items-center">
          <MemberInfo />
        </div>
      </div>

      {/* 계좌 정보 슬라이드 컴포넌트 */}
      <div className="mt-8 w-full flex justify-center">
        <div className="flex flex-col items-center">
          <AccountSlider />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
