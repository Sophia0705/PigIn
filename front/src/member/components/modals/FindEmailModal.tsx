import React, { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import axios from 'axios';
import axiosInstance from '../../../api/axiosInstance';
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트

const FindEmailModal: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const {
    isFindEmailModalOpen,
    openLoginModal,
    closeFindEmailModal,
    formData,
    setFormData,
  } = useMemberStore();

  // 상태 관리
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 상태
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false); // 인증번호 확인 여부
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지

  if (!isFindEmailModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  // 입력 필드가 변경될 때 호출되는 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 전화번호 입력 시 하이픈 자동 추가
    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/[^0-9]/g, '') // 숫자만 입력받기
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 하이픈 추가
      setFormData({ ...formData, phoneNumber: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 전화번호에서 하이픈 제거하는 함수
  const removeHyphenFromPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/-/g, ''); // 하이픈(-)을 제거
  };

  // SMS 인증 요청 핸들러
  const requestVerificationCode = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        name: formData.name,
        phoneNumber: sanitizedPhoneNumber,
      };

      const response = await axios.post(
        `${BASE_URL}member/mms-number-generate`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('requestData: ', requestData);

      if (response.status === 200) {
        setIsCodeSent(true);
        setSuccessMessage('인증번호 요청이 성공하였습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호 요청이 실패하였습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('인증번호 요청이 실패하였습니다.');
      setShowFailModal(true);
    }
  };

  // SMS 인증번호 검증 핸들러
  const verifyAuthenticationCode = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        phoneNumber: sanitizedPhoneNumber,
        authenticationNumber: authenticationNumber,
      };

      const response = await axios.post(
        `${BASE_URL}member/mms-number-compare`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setIsPhoneNumberVerified(true);
        setSuccessMessage('인증에 성공했습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호가 일치하지 않습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('인증번호 검증에 실패했습니다.');
      setShowFailModal(true);
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 이메일 찾기 API 요청 핸들러
  const findEmailByPhoneNumber = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      // 쿼리 파라미터로 전달할 데이터 설정
      const data = {
        name: formData.name,
        phoneNumber: sanitizedPhoneNumber,
      };

      // POST 요청 시, 데이터는 쿼리 파라미터로 전달
      const response = await axiosInstance.post(
        'member/find-id',
        data // 데이터를 request body로 전송
      );
      if (response.status === 200) {
        setSuccessMessage('이메일 찾기가 성공적으로 완료되었습니다.');
        console.log('');
        setShowSuccessModal(true);
        closeFindEmailModal();
        openLoginModal();
      } else {
        setFailMessage('이메일을 찾을 수 없습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('이메일 찾기 요청이 실패했습니다.');
      setShowFailModal(true);
    }
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.name &&
      formData.phoneNumber.length === 13 &&
      authenticationNumber.length === 6 &&
      isPhoneNumberVerified
    );
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    findEmailByPhoneNumber(); // 이메일 찾기 API 호출
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* 모달 본체 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          아이디 찾기
        </h2>
        <button
          onClick={closeFindEmailModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          X
        </button>
        {/* 회원가입 폼 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 이름 입력 필드 */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          {/* 전화번호 입력 필드와 인증 버튼 */}
          <div className="flex md:flex-row space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={14} // 하이픈 포함 길이, 수정 가능
            />
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ${
                formData.phoneNumber.length === 13
                  ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={formData.phoneNumber.length !== 13}
            >
              인증 요청
            </button>
          </div>
          <hr className="w-[240px] ml-0 border-t border-gray-300 relative top-[-12px]" />

          {/* 인증번호 입력 필드 */}
          {isCodeSent && (
            <>
              <input
                type="text"
                value={authenticationNumber} // authenticationNumber 상태를 사용
                onChange={handleAuthNumberChange} // 입력 변경 시 상태 업데이트
                placeholder="인증번호 입력"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                maxLength={6} // 인증번호는 6자리로 제한
              />
              {/* 인증 버튼 */}
              <button
                type="button"
                onClick={verifyAuthenticationCode} // 인증번호 검증 핸들러 호출
                className={`w-full mt-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  isPhoneNumberVerified
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 인증 완료 시 비활성화
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                disabled={isPhoneNumberVerified} // 인증 완료 시 버튼 비활성화
              >
                {isPhoneNumberVerified ? '인증 완료' : '인증 확인'}{' '}
                {/* 인증 완료 여부에 따라 텍스트 변경 */}
              </button>
            </>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            아이디 찾기
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
      </div>
    </div>
  );
};

export default FindEmailModal;
