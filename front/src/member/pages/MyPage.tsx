import React from "react";
import { UserInfo } from "../components/UserInfo";
import { AccountSlider } from "../components/AccountSlider";

const MyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-customDarkGreen p-4">
      {/* 회원 정보 컴포넌트 */}
      <UserInfo />

      {/* 계좌 정보 슬라이드 컴포넌트 */}
      <AccountSlider />
    </div>
  );
};

export default MyPage;
