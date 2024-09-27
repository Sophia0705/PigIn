import React, { useEffect } from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
import IsLoginModal from '../components/modals/IsLoginModal';
import LoginModal from '../components/modals/LoginModal';
import SignUpModal from '../components/modals/SignUpModal';
import FindEmailModal from '../components/modals/FindEmailModal';
// import FindPasswordModal from '../components/modals/FindPasswordModal';
import { useStore } from '../../store/memberStore';
// import UpdateProfileModal from '../components/modals/UpdateProfileModal';
// import WithdrawalModal from '../components/modals/WithDrawalModal';
// import SpendingAccountRegisterModal from '../components/modals/SpendingAccountRegisterModal';

const MyPage: React.FC = () => {
  const {
    isLoggedIn,
    isIsLoginModalOpen,
    isLoginModalOpen,
    isSignUpModalOpen,
    isFindEmailModalOpen,
    // isFindPasswordModalOpen,
    openIsLoginModal,
    checkLoginStatus,
  } = useStore();

  useEffect(() => {
    checkLoginStatus();
    if (!isLoggedIn) {
      openIsLoginModal(); // 로그인 여부 모달을 띄움
    }
  }, [checkLoginStatus, isLoggedIn, openIsLoginModal]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* 상태에 따라 모달 렌더링 */}
      {isIsLoginModalOpen && <IsLoginModal />}
      {isLoginModalOpen && <LoginModal />}
      {isSignUpModalOpen && <SignUpModal />}
      {isFindEmailModalOpen && <FindEmailModal />}
      {/* {isFindPasswordModalOpen && <FindPasswordModal />}
      {isUpdateProfileModalOpen && <UpdateProfileModal />}
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
