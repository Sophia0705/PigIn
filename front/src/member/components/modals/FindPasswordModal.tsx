import React, { useState, useEffect } from 'react';
import { useMemberStore } from '../../../store/memberStore';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import { findPasswordAndSendVerificationCodeAPI } from '../../../api/member/findPasswordAndSendVerificationCodeAPI';
import { compareVerificationCodeAPI } from '../../../api/member/compareVerificationCodeAPI';
import { resetPasswordAPI } from '../../../api/member/resetPasswordAPI';
import NewPasswordConfirmInput from '../inputs/NewPasswordConfirmInput';
import NewPasswordInput from '../inputs/NewPasswordInput';
import { X } from 'lucide-react';
import { CgChevronLeft } from 'react-icons/cg'; // 뒤로 가기 아이콘
import { FaCheckCircle } from 'react-icons/fa';
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트
import SubmissionCompleteModal from './SubmissionCompleteModal'; // 최종 제출 성공 모달 컴포넌트

const FindPasswordModal: React.FC = () => {
  const {
    formData,
    setFormData,
    closeFindPasswordModal,
    openLoginModal,
    isFindPasswordModalOpen,
  } = useMemberStore(); // Zustand 상태 관리

  // 인증 상태 관리
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 요청 여부
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호 입력 값
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false); // 인증 여부 상태
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false); // 제출 완료 상태

  // 모달이 열릴 때 formData 초기화
  useEffect(() => {
    if (isFindPasswordModalOpen) {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    }
  }, [isFindPasswordModalOpen, setFormData]);

  // 뒤로 가기 버튼 클릭 시 호출되는 함수
  const handleBackClick = () => {
    closeFindPasswordModal(); // 모달 닫기
    openLoginModal(); // 로그인 모달 열기
  };

  // 이름, 이메일, 전화번호 입력 필드가 모두 채워졌는지 확인하는 함수
  useEffect(() => {
    const valid =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.length == 13; // 전화번호가 13자리(하이픈 포함)인 경우
    setIsFormValid(valid);
  }, [formData.name, formData.email, formData.phoneNumber]);

  if (!isFindPasswordModalOpen) return null;

  // 전화번호 형식 맞추기 함수
  const formatPhoneNumber = (value: string) => {
    const cleanedValue = value.replace(/\D/g, ''); // 숫자 이외의 문자는 제거
    if (cleanedValue.length <= 3) return cleanedValue;
    if (cleanedValue.length <= 7)
      return `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
    return `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 7)}-${cleanedValue.slice(7, 11)}`;
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedPhoneNumber = formatPhoneNumber(value); // 전화번호를 형식에 맞게 변환
    setFormData({ ...formData, phoneNumber: formattedPhoneNumber }); // 폼 데이터 업데이트
  };

  // 하이픈 제거 함수
  const removeHyphenFromPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/-/g, ''); // 하이픈 제거
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneNumberVerified) {
      if (formData.newPassword === formData.newPasswordConfirm) {
        // 비밀번호 재설정 API 호출
        const success = await resetPasswordAPI({
          email: formData.email,
          password: formData.newPassword,
        });
        if (success) {
          setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
          setIsSubmissionComplete(true);
        } else {
          setFailMessage('비밀번호 변경에 실패하였습니다.');
          setShowFailModal(true);
        }
      } else {
        setFailMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        setShowFailModal(true);
      }
    } else {
      setFailMessage('전화번호 인증이 완료되지 않았습니다.');
      setShowFailModal(true);
    }
  };

  // 인증번호 요청 함수 (API 요청 시 사용)
  const requestVerificationCode = async () => {
    const { name, phoneNumber, email } = formData; // formData에서 이름, 전화번호, 이메일 가져오기
    const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(phoneNumber);
    try {
      const success = await findPasswordAndSendVerificationCodeAPI({
        name,
        phoneNumber: sanitizedPhoneNumber,
        email,
      });
      if (success) {
        setIsCodeSent(true); // 인증번호 요청 상태로 업데이트
        setSuccessMessage('인증번호가 전송되었습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호 요청에 실패하였습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error in requestVerificationCode:', error);
      setFailMessage('인증번호 요청 중 오류가 발생했습니다.');
      setShowFailModal(true);
    }
  };

  // 인증번호 확인 함수
  const verifyAuthenticationCode = async () => {
    const sanitizedPhoneNumber = formData.phoneNumber.replace(/-/g, ''); // 하이픈 제거

    const success = await compareVerificationCodeAPI({
      phoneNumber: sanitizedPhoneNumber,
      authenticationNumber,
    });

    if (success) {
      setIsPhoneNumberVerified(true); // 인증 여부 업데이트
      setSuccessMessage('인증이 완료되었습니다.');
      setShowSuccessModal(true);
    } else {
      setFailMessage('인증번호가 일치하지 않습니다.');
      setShowFailModal(true);
    }
  };

  // 인증번호 입력 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  const handleSuccessModalClose = () => {
    openLoginModal(); // 로그인 모달 열기
    closeFindPasswordModal();
  };

  return (
    <div
      className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
      onClick={closeFindPasswordModal}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        {/* 뒤로가기 버튼 */}
        <p
          onClick={handleBackClick}
          className="absolute top-5 left-4 text-gray-400 hover:text-gray-600"
        >
          <CgChevronLeft size={32} />
        </p>
        <h2 className="text-xl font-bold mb-6 text-center">비밀번호 찾기</h2>
        {/* 닫기 버튼 */}
        <X
          onClick={closeFindPasswordModal}
          className="absolute top-5 right-5 w-8 h-8 text-gray-400 hover:text-gray-600"
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          <NameInput />
          <EmailInput />

          <div className="relative flex space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="전화번호 (예: 010-1234-5678)"
              className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              maxLength={13}
            />
            {/* 인증번호가 6자리 입력되고 인증 완료 시 체크 아이콘 표시 */}
            {authenticationNumber.length === 6 && isPhoneNumberVerified && (
              <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ${
                isPhoneNumberVerified
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isFormValid
                    ? 'bg-customAqua text-gray-900 hover:bg-customAqua'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={isPhoneNumberVerified || !isFormValid} // 인증 완료 시 비활성화
            >
              {isPhoneNumberVerified ? '인증 완료' : '인증 요청'}
            </button>
          </div>

          {isCodeSent && (
            <div className="relative flex space-x-2 items-center">
              <input
                type="text"
                value={authenticationNumber}
                onChange={handleAuthNumberChange}
                placeholder="인증번호 입력"
                className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
                maxLength={6}
              />
              {/* 인증번호가 6자리 입력되고 인증 완료 시 체크 아이콘 표시 */}
              {authenticationNumber.length === 6 && isPhoneNumberVerified && (
                <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
              <button
                type="button"
                onClick={verifyAuthenticationCode}
                className={`p-2 ml-2 rounded ${
                  isPhoneNumberVerified
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-customAqua text-gray-900'
                }`}
                disabled={isPhoneNumberVerified}
              >
                {isPhoneNumberVerified ? '인증 완료' : '인증 확인'}
              </button>
            </div>
          )}

          {isPhoneNumberVerified && (
            <>
              <NewPasswordInput />
              <NewPasswordConfirmInput />
            </>
          )}

          <button
            type="submit"
            className={`p-2 mt-4 bg-customAqua text-gray-700 rounded ${
              isPhoneNumberVerified ? '' : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!isPhoneNumberVerified}
          >
            비밀번호 재설정
          </button>
        </form>

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

        {/* 제출 성공 모달 */}
        {isSubmissionComplete && (
          <SubmissionCompleteModal
            onConfirm={handleSuccessModalClose}
            title={successMessage}
          />
        )}
      </div>
    </div>
  );
};

export default FindPasswordModal;
