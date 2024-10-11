import React, { useState, useEffect } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기
import { requestPhoneNumberVerificationAPI } from '../../../api/member/requestPhoneNumberVerificationAPI'; // 인증 요청 API
import { compareVerificationCodeAPI } from '../../../api/member/compareVerificationCodeAPI'; // 인증 확인 API
import SuccessModal from '../modals/SuccessModal'; // 성공 모달 컴포넌트
import FailModal from '../modals/FailModal'; // 실패 모달 컴포넌트
import { FaCheckCircle } from 'react-icons/fa';

const PhoneNumberInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // formData와 setFormData 가져오기
  const phoneNumber = formData.phoneNumber; // Zustand에서 전화번호 가져오기

  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 전송 여부
  const [isVerified, setIsVerified] = useState(false); // 인증 여부 상태
  const [isRequestDisabled, setIsRequestDisabled] = useState(false); // 요청 버튼 비활성화
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false); // 확인 버튼 비활성화
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호 입력 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지

  // 전화번호 하이픈 자동 추가 로직
  const formatPhoneNumber = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, ''); // 숫자만 남기기
    if (sanitizedValue.length <= 3) {
      return sanitizedValue; // 3자리 이하인 경우 그대로 반환
    } else if (sanitizedValue.length <= 7) {
      return `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3)}`; // 3-4 형식
    } else {
      return `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3, 7)}-${sanitizedValue.slice(7, 11)}`; // 3-4-4 형식
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value); // 하이픈 자동 추가
    setFormData({ ...formData, phoneNumber: formattedPhoneNumber }); // Zustand에서 전화번호 변경
  };

  // 인증번호 입력 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value); // 인증번호 입력 상태 업데이트
  };

  // 인증번호 요청 함수
  const requestVerificationCode = async () => {
    const sanitizedPhoneNumber = phoneNumber.replace(/-/g, ''); // 하이픈 제거
    const name = formData.name; // formData에서 이름 가져옴

    const success = await requestPhoneNumberVerificationAPI({
      name,
      phoneNumber: sanitizedPhoneNumber,
    });

    if (success) {
      setIsCodeSent(true); // 인증 코드 전송 여부 업데이트
      setIsRequestDisabled(true); // 요청 버튼 비활성화
      setSuccessMessage('인증 요청이 성공하였습니다.'); // 성공 메시지 설정
      setShowSuccessModal(true); // 성공 모달 표시
    } else {
      setFailMessage('인증 요청에 실패하였습니다.'); // 실패 메시지 설정
      setShowFailModal(true); // 실패 모달 표시
    }
  };

  // 인증번호 확인 함수
  const verifyAuthenticationCode = async () => {
    const sanitizedPhoneNumber = phoneNumber.replace(/-/g, ''); // 하이픈 제거

    const success = await compareVerificationCodeAPI({
      phoneNumber: sanitizedPhoneNumber,
      authenticationNumber,
    });

    if (success) {
      setFormData({ isPhoneVerified: true }); // Zustand 스토어에 인증 여부 true로 업데이트
      setIsVerified(true);
      setIsVerifyDisabled(true); // 확인 버튼 비활성화
      setSuccessMessage('인증이 완료되었습니다.'); // 성공 메시지 설정
      setShowSuccessModal(true); // 성공 모달 표시
    } else {
      setFailMessage('인증번호가 일치하지 않습니다.'); // 실패 메시지 설정
      setShowFailModal(true); // 실패 모달 표시
    }
  };

  // 인증 완료 시 alert 메시지 출력
  useEffect(() => {
    if (isVerified) {
      setSuccessMessage('인증이 완료되었습니다.'); // 성공 메시지 설정
      setShowSuccessModal(true); // 성공 모달 표시
    }
  }, [isVerified]);

  return (
    <>
      {/* 전화번호 입력 및 인증 요청 */}
      <div className="relative flex space-x-2 items-center">
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="전화번호 (예: 010-1234-5678)"
          className="flex-1 p-2 border-b border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          maxLength={13} // 하이픈 포함 13자리 제한
        />
        {/* 인증번호가 입력되고 인증 완료 시 체크 아이콘 표시 */}
        {authenticationNumber.length === 6 && isVerified && (
          <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
        <button
          type="button"
          onClick={requestVerificationCode}
          className={`p-2 rounded w-24 ${
            phoneNumber.length === 13 && !isRequestDisabled
              ? 'bg-[#9CF8E1] text-gray-700 hover:bg-[#9CF8E1]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={phoneNumber.length !== 13 || isRequestDisabled}
        >
          {isRequestDisabled ? '요청 완료' : '인증 요청'}
        </button>
      </div>

      {/* 인증번호 전송 성공 시 인증번호 입력 필드 */}
      {isCodeSent && (
        <>
          <p className="text-sm text-green-500 mt-2">
            인증번호가 전송되었습니다.
          </p>
          <div className="relative flex space-x-2 items-center">
            <input
              type="text"
              name="authenticationNumber"
              value={authenticationNumber}
              onChange={handleAuthNumberChange}
              placeholder="인증번호 입력"
              className="flex-1 p-2 border-b border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={6} // 인증번호는 6자리로 제한
            />
            {/* 인증번호가 입력되고 인증 완료 시 체크 아이콘 표시 */}
            {authenticationNumber.length === 6 && isVerified && (
              <FaCheckCircle className="absolute right-[6.5rem] top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            <button
              type="button"
              onClick={verifyAuthenticationCode}
              className={`w-24 mt-2 p-2 rounded ${
                authenticationNumber.length === 6 && !isVerifyDisabled
                  ? 'bg-customAqua text-gray-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={authenticationNumber.length !== 6 || isVerifyDisabled}
            >
              {isVerifyDisabled ? '확인 완료' : '인증 확인'}
            </button>
          </div>
        </>
      )}
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
    </>
  );
};

export default PhoneNumberInput;
