import React from "react";
import { UserInfo } from "../components/UserInfo";
import AccountSlider from "../components/AccountSlider"; // 기본 내보내기는 중괄호 없이 불러와야 함

const MyPage: React.FC = () => {
  return (
    <div className="w-[412px] h-[915px] flex flex-col items-center bg-customDarkGreen p-4">
      {/* 회원 정보 컴포넌트 */}
      <UserInfo />

      {/* 계좌 정보 슬라이드 컴포넌트 */}
      <AccountSlider />
    </div>
  );
};

export default MyPage;
