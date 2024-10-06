import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle, FaUserMinus } from 'react-icons/fa';
import PhoneNumberInput from '../inputs/PhoneNumberInput';
import NewPasswordInput from '../inputs/NewPasswordInput';
import NewPasswordConfirmInput from '../inputs/NewPasswordConfirmInput';
import SavingRateInput from '../inputs/SavingRateInput';
import { updateMemberInfoAPI } from '../../../api/member/updateMemberInfoAPI';
import { getMemberInfoAPI } from '../../../api/member/getMemberInfoAPI';
import { useMemberStore } from '../../../store/memberStore'; // 상태 관리
import SignOutModal from './SignOutModal';

const UpdateProfileModal: React.FC = () => {
  const {
    closeUpdateProfileModal,
    openSignOutModal,
    isSignOutModalOpen,
    formData,
    setFormData,
  } = useMemberStore();

  const [currentPassword, setCurrentPassword] = useState(''); // 기존 비밀번호
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // 기존 비밀번호 표시 여부
  const [isPasswordEditEnabled, setIsPasswordEditEnabled] = useState(false); // 비밀번호 수정 여부

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const memberInfo = await getMemberInfoAPI();
        setFormData({
          phoneNumber: formatPhoneNumber(memberInfo.phoneNumber), // 전화번호 설정
          savingRate: memberInfo.savingRate, // 저축률 설정
        });
      } catch (error) {
        console.error('회원 정보 불러오기 실패:', error);
      }
    };

    fetchMemberInfo();
  }, [setFormData]);

  // 전화번호에서 하이픈을 제거하는 함수
  const removeHyphens = (phoneNumber: string) => {
    return phoneNumber.replace(/-/g, ''); // 모든 하이픈을 제거
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, ''); // 숫자만 남기기
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/); // 3-3~4-4 형태로 매칭

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`; // 010-1234-5678 같은 형식 반환
    }
    return phoneNumber; // 형식이 맞지 않으면 원본 반환
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formIsValid()) {
      alert('입력한 정보를 확인해 주세요.');
      return;
    }

    const updateData: {
      savingRate: number;
      phoneNumber: string;
      oldPassword: string;
      newPassword?: string;
      change: boolean;
    } = {
      savingRate: formData.savingRate, // Zustand에서 가져온 저축률 사용
      phoneNumber: removeHyphens(formData.phoneNumber), // 하이픈 제거한 전화번호 사용, // Zustand에서 가져온 전화번호 사용
      oldPassword: currentPassword,
      change: isPasswordEditEnabled ? true : false, // 비밀번호 수정 여부를 결정
    };

    if (isPasswordEditEnabled) {
      updateData.newPassword = formData.newPassword; // 새 비밀번호 포함
    }

    try {
      const response = await updateMemberInfoAPI(updateData);
      if (response) {
        alert('회원 정보 수정 완료!');
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정 중 오류가 발생했습니다.');
    }
  };

  // 영어와 숫자가 섞여 있는지 확인하는 함수
  const hasNumberAndLetter = (password: string) => {
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return hasNumber && hasLetter;
  };

  const formIsValid = () => {
    // 핸드폰 인증 여부 확인
    if (!formData.isPhoneVerified) return false;
    console.log(1);

    // 기존 비밀번호 8자 이상, 영어와 숫자 섞임 여부 확인
    if (currentPassword.length < 8 || !hasNumberAndLetter(currentPassword)) {
      return false;
    }
    console.log(2);

    // 비밀번호 변경이 체크된 경우에만 새로운 비밀번호 검증
    if (isPasswordEditEnabled) {
      // 새 비밀번호가 8자 이상이며, 영어와 숫자가 섞여 있는지 확인
      console.log('newPassword:', formData.newPassword); // 새 비밀번호가 제대로 설정되었는지 확인
      console.log('confirmNewPassword:', formData.newPasswordConfirm); // 새 비밀번호 확인 값이 올바른지 확인
      if (
        !formData.newPassword ||
        formData.newPassword.length < 8 ||
        !hasNumberAndLetter(formData.newPassword)
      ) {
        console.log('새 비밀번호 검증 실패');
        return false;
      }
      console.log(3);
      // 새 비밀번호와 확인 비밀번호 일치 여부 확인
      if (formData.newPassword !== formData.newPasswordConfirm) {
        console.log('새 비밀번호와 확인 비밀번호가 일치하지 않음');
        return false;
      }
    }
    console.log(4);

    return true; // 모든 검증을 통과한 경우 true 반환
  };

  return (
    <div
      className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
      onClick={closeUpdateProfileModal}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 회원 정보 수정 제목 및 회원 탈퇴 버튼 */}
        <div className="relative flex items-center justify-between w-full">
          <h2 className="text-xl font-bold mb-4 md:mb-6 w-full text-center">
            회원 정보 수정
          </h2>
          <button
            onClick={openSignOutModal}
            className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded flex items-center absolute top-[-1px] right-0"
          >
            <FaUserMinus className="mr-0" /> {/* 탈퇴 아이콘 */}
            탈퇴
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 기존 비밀번호 확인 필드 */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="기존 비밀번호 입력"
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showCurrentPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
              {currentPassword &&
                (currentPassword.length >= 8 ? (
                  <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
                ) : (
                  <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
                ))}
            </div>
            <p className="text-xs text-left text-gray-500 mt-1 ml-1">
              8자 이상, 영문, 숫자 포함
            </p>
          </div>

          <PhoneNumberInput />

          {/* 비밀번호 변경 여부 체크박스 */}
          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="editPassword"
              checked={isPasswordEditEnabled}
              onChange={() => {
                console.log('Current state:', isPasswordEditEnabled); // 상태 확인
                setIsPasswordEditEnabled(!isPasswordEditEnabled);
              }}
              className="mr-2"
            />
            <label htmlFor="editPassword" className="text-sm">
              비밀번호 변경
            </label>
          </div>

          {/* 새 비밀번호 및 확인 필드 */}
          {isPasswordEditEnabled && (
            <>
              <NewPasswordInput />
              <NewPasswordConfirmInput />
            </>
          )}

          {/* 저축률 인풋 */}
          <SavingRateInput />

          {/* 정보 수정 버튼 */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className={`w-full py-2 rounded ${
                formIsValid()
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formIsValid()}
            >
              정보 수정
            </button>
            <button
              type="button"
              className="w-full py-2 rounded bg-gray-500 text-white"
              onClick={closeUpdateProfileModal}
            >
              취소
            </button>
          </div>
        </form>
        {isSignOutModalOpen && <SignOutModal />}
      </div>
    </div>
  );
};

export default UpdateProfileModal;
