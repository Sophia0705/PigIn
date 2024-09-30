import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore';
import { signOutAPI } from '../../../api/member/signOutAPI'; // 회원 탈퇴 API 함수
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트

const SignOutModal: React.FC = () => {
  // Zustand 스토어에서 상태와 모달 제어 함수 가져오기
  const { isSignOutModalOpen, closeSignOutModal, formData } = useMemberStore();

  // 상태 관리 훅: 성공 및 실패 모달, 이메일 유효성 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  // 회원 탈퇴 모달 상태가 열리지 않으면 렌더링하지 않음
  if (!isSignOutModalOpen) return null;

  // 이메일 유효성 검사 함수
  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 정규식
    return regex.test(email); // 유효성 검사 결과 반환
  };

  // 이메일 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIsEmailValid(isEmailFormatValid(value)); // 이메일 유효성 체크
  };

  // 회원 탈퇴 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !isEmailFormatValid(formData.email)) {
      setIsEmailValid(false);
      setFailMessage('유효한 이메일 주소를 입력해주세요.');
      setShowFailModal(true); // 실패 모달 표시
      return;
    }

    try {
      // SignOutAPI 호출, 회원 탈퇴 요청
      await signOutAPI({ username: formData.email });

      // 성공 시 성공 모달 표시
      setSuccessMessage('회원 탈퇴가 완료되었습니다.');
      setShowSuccessModal(true);
    } catch (error) {
      // 오류 처리: 실패 모달 표시
      console.error('회원 탈퇴 실패:', error);
      setFailMessage('회원 탈퇴에 실패했습니다.');
      setShowFailModal(true);
    }
  };

  return (
    <div className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* 모달 본체 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원탈퇴
        </h2>
        <button
          onClick={closeSignOutModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          X
        </button>
        {/* 회원탈퇴 폼 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 이메일 입력 필드 */}
          <input
            type="email"
            name="email"
            defaultValue={formData.email}
            onChange={handleChange}
            placeholder="이메일 (예: example@example.com)"
            className={`flex-1 p-2 border-none rounded focus:outline-none focus:ring-2 ${
              isEmailValid ? 'focus:ring-green-300' : 'focus:ring-red-500'
            }`}
          />
          {/* 이메일 유효성 오류 메시지 */}
          {!isEmailValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 이메일 주소를 입력해주세요.
            </p>
          )}
          {/* 회원탈퇴 버튼 */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isEmailValid
                ? 'bg-[#FF2414] text-white font-semibold hover:bg-[#FF2414]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isEmailValid}
          >
            회원 탈퇴
          </button>
        </form>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          setShowModal={setShowSuccessModal}
          title={successMessage}
          buttonText="확인"
          buttonColor="bg-customAqua"
          buttonHoverColor="hover:bg-[#7ee9ce]"
        />
      )}

      {/* 실패 모달 */}
      {showFailModal && (
        <FailModal
          setShowModal={setShowFailModal}
          title={failMessage}
          buttonText="확인"
          buttonColor="bg-customRed"
          buttonHoverColor="hover:bg-[#FF2414]"
        />
      )}
    </div>
  );
};

export default SignOutModal;
