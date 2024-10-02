import React, { useState, useEffect } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand 스토어 가져오기
import { requestPhoneNumberVerificationAPI } from '../../../api/member/requestPhoneNumberVerificationAPI'; // 인증 요청 API
import { compareVerificationCodeAPI } from '../../../api/member/compareVerificationCodeAPI'; // 인증 확인 API

const PhoneNumberInput: React.FC = () => {
  const { formData, setFormData } = useMemberStore(); // formData와 setFormData 가져오기
  const phoneNumber = formData.phoneNumber; // Zustand에서 전화번호 가져오기

  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 전송 여부
  const [isVerified, setIsVerified] = useState(false); // 인증 여부 상태
  const [isRequestDisabled, setIsRequestDisabled] = useState(false); // 요청 버튼 비활성화
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false); // 확인 버튼 비활성화
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호 입력 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

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

  // SMS 인증 요청 함수
  const requestVerificationCode = async () => {
    setIsLoading(true);
    const sanitizedPhoneNumber = phoneNumber.replace(/-/g, ''); // 하이픈 제거
    const name = formData.name; // formData에서 이름 가져옴

    const success = await requestPhoneNumberVerificationAPI({
      name,
      phoneNumber: sanitizedPhoneNumber,
    });

    if (success) {
      setIsCodeSent(true); // 인증 코드 전송 여부 업데이트
      setIsRequestDisabled(true); // 요청 버튼 비활성화
      console.log('인증 요청 성공');
    } else {
      console.log('인증 요청 실패');
    }
    setIsLoading(false); // 로딩 상태 해제
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
      console.log();
      setIsVerifyDisabled(true); // 확인 버튼 비활성화
      console.log('인증 성공');
    } else {
      console.log('인증 실패');
    }
  };

  // 인증 완료 시 alert 메시지 출력
  useEffect(() => {
    if (isVerified) {
      alert('인증이 완료되었습니다.');
    }
  }, [isVerified]);

  return (
    <>
      {/* 전화번호 입력 및 인증 요청 */}
      <div className="flex md:flex-row space-x-2 items-center">
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="전화번호 (예: 010-1234-5678)"
          className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          maxLength={13} // 하이픈 포함 13자리 제한
        />
        <button
          type="button"
          onClick={requestVerificationCode}
          className={`p-2 rounded ${
            phoneNumber.length === 13 && !isRequestDisabled && !isLoading
              ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={phoneNumber.length !== 13 || isRequestDisabled || isLoading}
        >
          {isRequestDisabled
            ? '요청 완료'
            : isLoading
              ? '요청 중...'
              : '인증 요청'}
        </button>
      </div>

      {/* 인증번호 전송 성공 시 인증번호 입력 필드 */}
      {isCodeSent && (
        <>
          <p className="text-sm text-green-500 mt-2">
            인증번호가 전송되었습니다.
          </p>
          <input
            type="text"
            name="authenticationNumber"
            value={authenticationNumber}
            onChange={handleAuthNumberChange}
            placeholder="인증번호 입력"
            className="mt-2 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            maxLength={6} // 인증번호는 6자리로 제한
          />
          <button
            type="button"
            onClick={verifyAuthenticationCode}
            className={`w-full mt-2 p-2 rounded ${
              authenticationNumber.length === 6 && !isVerifyDisabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={authenticationNumber.length !== 6 || isVerifyDisabled}
          >
            {isVerifyDisabled ? '확인 완료' : '인증 확인'}
          </button>
        </>
      )}

      <hr className="w-full border-t border-gray-300 mt-4" />
    </>
  );
};

export default PhoneNumberInput;
