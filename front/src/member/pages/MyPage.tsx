// import React, { useEffect, useState } from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
// import { useStore } from '../../store/memberStore';
// import LoginModalManager from '../components/LoginModalManager';
// import { getAccessToken } from '../../utils/localUtils';
// import UpdateProfileModal from '../components/modals/UpdateProfileModal';
// import WithdrawalModal from '../components/modals/WithDrawalModal';
// import SpendingAccountRegisterModal from '../components/modals/SpendingAccountRegisterModal';
import AuthGuard from '../components/AuthGuard';
import { FiLogOut } from 'react-icons/fi'; // 로그아웃 아이콘 임포트
import { LogoutAPI } from '../../api/member/LogoutAPI';

const MyPage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen w-full flex flex-col items-center">
        {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
        <div className="relative w-full flex items-center justify-end p-4 bg-customDarkGreen">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white">
            MyPage
          </h1>
          {/* 로그아웃 버튼 */}
          <button
            onClick={LogoutAPI}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
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
    </AuthGuard>
  );
};

export default MyPage;
