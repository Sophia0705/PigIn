import React, { useState, useEffect } from 'react';
import { MemberInfo } from '../components/MemberInfo'; // 회원 정보를 보여주는 컴포넌트
import AccountSlider from '../components/AccountSlider'; // 계좌 정보를 보여주는 슬라이더 컴포넌트
import { FaUserMinus } from 'react-icons/fa'; // 탈퇴 버튼에 사용할 아이콘
import UpdateProfileModal from '../components/modals/UpdateProfileModal'; // 회원 정보 수정 모달 컴포넌트
import WithdrawalModal from '../components/modals/WithDrawalModal'; // 회원 탈퇴 모달 컴포넌트
import { useAuthStore } from '../../store/AuthStore';
// import IsLoginModal from '../components/modals/IsLoginModal';
import LoginModal from '../components/modals/LoginModal';

const MyPage: React.FC = () => {
  const {
    isLoggedIn,
    isLoginModalOpen,
    checkLoginStatus,
    closeLoginModal,
    // openLoginModal,
  } = useAuthStore(); // 상태와 함수들 가져오기
  // 회원 정보 수정 모달 열림/닫힘 상태를 관리하는 useState
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // 회원 탈퇴 모달 열림/닫힘 상태를 관리하는 useState
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // 회원 탈퇴 모달 열기
  const openWithdrawalModal = () => setIsWithdrawalModalOpen(true);
  // 회원 탈퇴 모달 닫기
  const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

  // 회원 정보 수정 모달 열기
  const openUpdateProfileModal = () => setIsUpdateModalOpen(true);
  // 회원 정보 수정 모달 닫기
  const closeUpdateProfileModal = () => setIsUpdateModalOpen(false);

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트 마운트 시 로그인 상태 확인
  }, [checkLoginStatus]);

  // 로그인 여부에 따라 모달을 띄우고 페이지를 렌더링하지 않음
  // if (!isLoggedIn && isLoginModalOpen) {
  //   return (
  //     <IsLoginModal
  //       isOpen={isLoginModalOpen}
  //       onClose={closeLoginModal}
  //       onOpenLoginModal={openLoginModal}
  //     />
  //   );
  // }

  // 로그인 여부에 따라 로그인 모달을 띄우고 페이지를 렌더링하지 않음
  if (!isLoggedIn && isLoginModalOpen) {
    return (
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onOpenSignUpModal={() => {}}
        onOpenFindIdModal={() => {}}
        onOpenFindPasswordModal={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="flex justify-between items-center w-screen p-4 bg-customDarkGreen text-white rounded-b-lg">
        {/* 페이지 타이틀 */}
        <h1 className="text-2xl font-bold text-white">My Page</h1>
        {/* 회원 탈퇴 버튼: 클릭 시 회원 탈퇴 모달을 여는 함수 호출 */}
        <button
          onClick={openWithdrawalModal}
          className="absolute right-4 top-0 text-xs text-red-400 hover:text-red-600 flex items-center"
        >
          <FaUserMinus className="mr-1" /> {/* 회원 탈퇴 아이콘 */}
          탈퇴
        </button>
      </div>

      {/* 회원 정보 컴포넌트 */}
      <div className="mt-4 w-full flex justify-center relative">
        <div className="flex flex-col items-center">
          {/* 회원 정보를 보여주는 MemberInfo 컴포넌트 */}
          <MemberInfo openUpdateProfileModal={openUpdateProfileModal} />
        </div>
      </div>

      {/* 계좌 정보 슬라이더 컴포넌트 */}
      <div className="mt-8 w-full flex justify-center">
        <div className="flex flex-col items-center">
          {/* 계좌 정보를 보여주는 AccountSlider 컴포넌트 */}
          <AccountSlider />
        </div>
      </div>

      {/* 회원 정보 수정 모달이 열려 있을 때만 표시 */}
      {isUpdateModalOpen && (
        <UpdateProfileModal closeModal={closeUpdateProfileModal} />
      )}

      {/* 회원 탈퇴 모달이 열려 있을 때만 표시 */}
      {isWithdrawalModalOpen && (
        <WithdrawalModal closeModal={closeWithdrawalModal} />
      )}
    </div>
  );
};

export default MyPage;
