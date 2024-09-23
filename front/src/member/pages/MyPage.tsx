import React, { useState } from 'react';
import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
import { FaUserMinus } from 'react-icons/fa';
import UpdateProfileModal from '../modal/UpdateProfileModal';
import WithdrawalModal from '../modal/WithdrawalModal';

const MyPage: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false); // 탈퇴 모달 상태

  // 회원 탈퇴 모달 열기/닫기
  const openWithdrawalModal = () => setIsWithdrawalModalOpen(true);
  const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

  // 회원 정보 수정 모달 열기/닫기
  const openUpdateProfileModal = () => setIsUpdateModalOpen(true);
  const closeUpdateProfileModal = () => setIsUpdateModalOpen(false);

  return (
    <div className="w-[412px] h-[915px] flex flex-col items-center bg-customDarkGreen p-4">
      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="w-full pt-0 flex justify-center relative">
        <h1 className="text-2xl font-bold text-white">My Page</h1>
        {/* 회원 탈퇴 작은 버튼 */}
        <button
          onClick={openWithdrawalModal}
          className="absolute right-4 top-0 text-xs text-red-400 hover:text-red-600 flex items-center"
        >
          <FaUserMinus className="mr-1" />
          탈퇴
        </button>
      </div>

      {/* 회원 정보 컴포넌트 */}
      <div className="mt-4 w-full flex justify-center relative">
        <div className="flex flex-col items-center">
          <MemberInfo openUpdateProfileModal={openUpdateProfileModal} />
        </div>
      </div>

      {/* 계좌 정보 슬라이드 컴포넌트 */}
      <div className="mt-8 w-full flex justify-center">
        <div className="flex flex-col items-center">
          <AccountSlider />
        </div>
      </div>

      {/* 회원 정보 수정 모달 */}
      {isUpdateModalOpen && (
        <UpdateProfileModal closeModal={closeUpdateProfileModal} />
      )}

      {/* 회원 탈퇴 모달 */}
      {isWithdrawalModalOpen && (
        <WithdrawalModal closeModal={closeWithdrawalModal} />
      )}
    </div>
  );
};

export default MyPage;
