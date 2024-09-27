import React, { useEffect } from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
import { useStore } from '../../store/memberStore';
import LoginModalManager from '../components/LoginModalManager';
// import UpdateProfileModal from '../components/modals/UpdateProfileModal';
// import WithdrawalModal from '../components/modals/WithDrawalModal';
// import SpendingAccountRegisterModal from '../components/modals/SpendingAccountRegisterModal';

const MyPage: React.FC = () => {
  const { checkLoginStatus, isLoggedIn, openLoginModal } = useStore();

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태를 확인
    if (!isLoggedIn) {
      openLoginModal(); // 로그인되지 않은 경우 로그인 모달을 열기
    }
  }, [checkLoginStatus, isLoggedIn, openLoginModal]); // 의존성 배열에 로그인 상태 추가

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* 상태에 따라 모달 렌더링 */}
      {/* ModalManager를 통해 모달 관리 */}
      <LoginModalManager />
      {/* {isUpdateProfileModalOpen && <UpdateProfileModal />}
      {isWithdrawlModalOpen && <WithdrawalModal />}
      {isSpendingAccountRegisterModalOpen && <SpendingAccountRegisterModal />} */}

      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="flex justify-between items-center w-screen p-4 bg-customDarkGreen text-white rounded-b-lg">
        <h1 className="text-2xl font-bold text-white">My Page</h1>
      </div>

      {/* 회원 정보 컴포넌트 */}
      <div className="mt-4 w-full flex justify-center relative">
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
