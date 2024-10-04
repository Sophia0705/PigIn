// import React, { useEffect, useState } from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
import { useEffect } from 'react';
import { useMemberStore } from '../../store/memberStore';
// import LoginModalManager from '../components/LoginModalManager';
// import { getAccessToken } from '../../utils/localUtils';
// import UpdateProfileModal from '../components/modals/UpdateProfileModal';
// import SignOutModal from '../components/modals/SignOutModal';
// import SpendingAccountRegisterModal from '../components/modals/SpendingAccountRegisterModal';
import { FiLogOut } from 'react-icons/fi'; // 로그아웃 아이콘 임포트
import { logoutAPI } from '../../api/member/logoutAPI';

const MyPage: React.FC = () => {
  const { checkLoginStatus, isLoggedIn } = useMemberStore();

  useEffect(() => {
    checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인
  }, [checkLoginStatus]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center ">
      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="relative w-full flex items-center justify-end p-4 bg-customDarkGreen">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white mt-6">
          MyPage
        </h1>
        {/* 로그아웃 버튼: 로그인 상태일 때만 렌더링 */}
        {isLoggedIn && (
          <button
            onClick={logoutAPI}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        )}
      </div>
      {/* 회원 정보 컴포넌트 */}
      <div className="mt-8 w-full flex justify-center relative">
        <MemberInfo />
      </div>

      {/* 계좌 정보 슬라이더 컴포넌트 */}
      <div className="mt-8 w-full flex justify-center">
        <AccountSlider />
      </div>
    </div>
  );
};

export default MyPage;
