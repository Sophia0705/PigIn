import React, { useState } from 'react';
import { MemberInfo } from '../components/MemberInfo'; // 회원 정보를 보여주는 컴포넌트
import AccountSlider from '../components/AccountSlider'; // 계좌 정보를 보여주는 슬라이더 컴포넌트
import { FaUserMinus } from 'react-icons/fa'; // 탈퇴 버튼에 사용할 아이콘
import UpdateProfileModal from '../components/modals/UpdateProfileModal'; // 회원 정보 수정 모달 컴포넌트
import WithdrawalModal from '../components/modals/WithDrawalModal'; // 회원 탈퇴 모달 컴포넌트

const MyPage: React.FC = () => {
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

  return (
    <div className="w-full h-full flex flex-col items-center bg-customDarkGreen p-4">
      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="w-full pt-0 flex justify-center relative">
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
