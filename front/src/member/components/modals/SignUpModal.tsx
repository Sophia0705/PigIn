import React, { useState } from 'react';
import { AxiosError } from 'axios'; // AxiosError를 임포트
import { useStore } from '../../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘
import axios from 'axios';
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트

const SignUpModal: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Zustand 스토어에서 상태와 모달 제어 함수 가져오기
  const {
    openLoginModal,
    isSignUpModalOpen,
    closeSignUpModal,
    formData,
    setFormData,
  } = useStore();

  // 상태 관리 훅: 인증번호 전송 여부, 비밀번호 확인, 이메일 및 생년월일 유효성 상태 등
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 상태
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false); // 인증번호 확인 여부 상태 추가
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 여부
  const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 유효성 상태
  const [isEmailAvailable, setIsEmailAvailable] = useState(false); // 이메일 사용 가능 여부 (중복)
  const [isBirthValid, setIsBirthValid] = useState(true); // 생년월일 유효성 상태

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isSignUpModalOpen) return null;
  // const [savingRate, setSavingRate] = useState(0); // 저축률 상태

  // 이메일 유효성 검사 함수
  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 정규식
    return regex.test(email); // 유효성 검사 결과 반환
  };

  // 이메일 중복 확인 요청 핸들러
  const checkEmailDuplication = async () => {
    try {
      const requestData = {
        email: formData.email, // 요청 바디에 이메일을 포함
      };

      // 전송할 데이터 콘솔 출력
      console.log('이메일 중복 확인 요청 데이터:', requestData);

      const response = await axios.post(
        `${BASE_URL}member/email-check`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 처리
      if (response.status === 200) {
        // 이메일이 사용 가능한 경우
        setIsEmailAvailable(true);
        setSuccessMessage('사용 가능한 이메일입니다.');
        setShowSuccessModal(true); // 성공 모달 열기
      }
    } catch (error) {
      // error를 AxiosError로 타입 단언하여 처리
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 409) {
        console.log('중복된 이메일입니다.');
        setFailMessage('이미 사용 중인 이메일입니다.');
        setShowFailModal(true); // 실패 모달 열기
      } else {
        console.error('알 수 없는 오류 발생', error);
        setFailMessage('알 수 없는 오류가 발생했습니다.');
        setShowFailModal(true); // 기타 오류 처리
      }
    }
  };

  // 비밀번호 유효성 검사 함수: 최소 8자 이상, 영문자와 숫자 포함
  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password); // 유효성 검사 결과 반환
  };

  // 생년월일 유효성 검사 함수
  const isBirthFormatValid = (birth: string): boolean => {
    const regex = /^(?:[0-9]{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(birth); // 유효성 검사 결과 반환
  };

  // 저축률 입력 핸들러: 입력 값이 유효한 범위(0~10)인지 확인 후 상태 업데이트
  // const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value;

  //   // 소수점 앞에 '0'이 있는 경우 소수점을 포함한 값은 그대로 유지
  //   if (value.startsWith('0') && value.length > 1 && !value.includes('.')) {
  //     value = value.slice(1); // 소수점이 없을 때만 앞의 0을 제거
  //   }

  //   // 숫자 값으로 변환하여 범위 검증 후 상태 업데이트
  //   const parsedValue = parseFloat(value);
  //   if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) {
  //     setSavingRate(parsedValue); // 숫자 값으로 상태 업데이트
  //   } else if (value === '') {
  //     // 값이 빈 문자열일 때 0으로 설정
  //     setSavingRate(0);
  //   }
  // };

  // 입력 필드가 변경될 때 호출되는 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 이메일 유효성 검사
    if (name === 'email') {
      setIsEmailValid(isEmailFormatValid(value));
    }

    // 생년월일 유효성 검사
    if (name === 'birth') {
      setIsBirthValid(isBirthFormatValid(value));
    }

    // 전화번호 입력 시 하이픈 자동 추가
    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/[^0-9]/g, '') // 숫자만 입력받기
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 하이픈 추가
      setFormData({ ...formData, phoneNumber: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (name === 'password' || name === 'passwordConfirm') {
      setIsPasswordMatch(formData.password === passwordConfirm);
    }
  };

  // 비밀번호 필드 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  // 비밀번호 확인 필드 입력 핸들러
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setPasswordConfirm(value);
    setIsPasswordMatch(formData.password === value); // 비밀번호 일치 여부 설정
  };

  // 전화번호에서 하이픈 제거하는 함수
  const removeHyphenFromPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/-/g, ''); // 하이픈(-)을 제거
  };

  // SMS 인증 요청 핸들러: 서버에 전화번호 전송하여 인증번호 요청
  const requestVerificationCode = async () => {
    try {
      // 하이픈 제거한 전화번호
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        name: formData.name, // 요청 바디에 이름 추가
        phoneNumber: sanitizedPhoneNumber, // 하이픈 제거한 전화번호 추가
      };

      // 전송할 데이터 콘솔 출력
      console.log('SMS 인증 요청 데이터:', requestData);

      const response = await axios.post(
        `${BASE_URL}member/mms-number-generate`, // https://j11c203.p.ssafy.io/api/
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 처리
      if (response.status === 200) {
        setIsCodeSent(true); // 인증번호 요청 성공 시 상태 변경
        setIsPhoneNumberVerified(false);
        setSuccessMessage('인증번호 요청이 성공하였습니다.');
        setShowSuccessModal(true); // 인증번호 전송 성공 모달 표시
      } else {
        setFailMessage('인증번호 요청이 실패하였습니다.');
        setShowFailModal(false); // 실패 시 성공 모달 숨김
      }
    } catch (error) {
      console.error('Error:', error);
      setFailMessage('인증번호 요청이 실패하였습니다.');
      setShowFailModal(false); // 실패 시 실패 모달 표시
    }
  };

  // SMS 인증번호 검증 핸들러: 서버에 전화번호와 인증번호 전송
  const verifyAuthenticationCode = async () => {
    try {
      // 하이픈 제거한 전화번호
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );

      const requestData = {
        phoneNumber: sanitizedPhoneNumber, // 하이픈 제거한 전화번호 추가
        authenticationNumber: authenticationNumber, // 요청 바디에 인증번호 추가
      };

      // 전송할 데이터 콘솔 출력
      console.log('인증번호 검증 요청 데이터:', requestData);

      const response = await axios.post(
        `${BASE_URL}member/mms-number-compare`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 처리
      if (response.status === 200) {
        // 인증 성공 처리
        console.log('인증 성공:', response.data);
        setIsPhoneNumberVerified(true);
      } else {
        // 인증 실패 처리
        console.log('인증 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      // 실패 처리
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    const { phoneNumber, name, email, birth, password } = formData;
    // 필요한 데이터만 처리
    const sanitizedFormData = {
      phoneNumber: phoneNumber.replace(/-/g, ''),
      name,
      email,
      birth,
      password,
    };
    console.log('Submitted Data:', sanitizedFormData); // 하이픈 제거된 데이터 출력

    // 서버로 POST 요청 보내기
    try {
      const response = await axios.post(
        `${BASE_URL}member/sign-up`,
        sanitizedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 성공 시 처리
      console.log('회원가입 성공:', response.data);
      setSuccessMessage('회원가입이 완료되었습니다.');
      setShowSuccessModal(true); // 성공 모달 열기
      closeSignUpModal();
      openLoginModal();
    } catch (error) {
      // 오류가 발생한 경우, error를 string으로 변환하여 처리
      if (axios.isAxiosError(error)) {
        // AxiosError 타입으로 오류를 처리
        console.error('회원가입 실패:', error);
        setFailMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        setShowFailModal(true); // 실패 모달 열기
      } else {
        console.error('알 수 없는 오류(전화번호 중복 포함):', error);
        setFailMessage('알 수 없는 오류가 발생했습니다.');
        setShowFailModal(true); // 실패 모달 열기
      }
    }
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.name &&
      isEmailValid &&
      isEmailAvailable &&
      formData.birth &&
      isBirthValid &&
      formData.phoneNumber.length === 13 &&
      authenticationNumber.length === 6 &&
      isPhoneNumberVerified &&
      isPasswordValid(formData.password) &&
      isPasswordMatch
    );
  };

  return (
    // 모달 배경
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* 모달 본체 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원가입
        </h2>
        <button
          onClick={closeSignUpModal}
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
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />
          <div className="flex space-x-2 items-center">
            {/* 이메일 입력 필드 */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 (예: example@example.com)"
              className={`flex-1 p-2 border-none rounded focus:outline-none focus:ring-2 ${
                isEmailValid ? 'focus:ring-green-300' : 'focus:ring-red-500'
              }`}
              disabled={isEmailAvailable} // 이메일 중복 확인이 완료되면 필드 비활성화
            />
            {/* 중복 확인 / 확인 완료 버튼 */}
            <button
              type="button"
              onClick={checkEmailDuplication}
              className={`p-2 rounded ${
                formData.email && isEmailValid && !isEmailAvailable
                  ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formData.email || !isEmailValid || isEmailAvailable} // 중복 확인 완료 시 버튼 비활성화
            >
              {isEmailAvailable ? '확인 완료' : '중복 확인'}
            </button>
          </div>
          <hr className="w-[240px] ml-0 border-t border-gray-300 relative top-[-12px]" />

          {/* 이메일 유효성 오류 메시지 */}
          {!isEmailValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 이메일 주소를 입력해주세요.
            </p>
          )}

          {/* 생년월일 입력 필드 */}
          <input
            type="text"
            name="birth"
            value={formData.birth}
            onChange={handleChange}
            placeholder="생년월일 (예: 000101)"
            className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
              isBirthValid
                ? 'border-gray-300 focus:ring-green-300'
                : 'border-red-500 focus:ring-red-500'
            }`}
          />
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />
          {!isBirthValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 생년월일을 입력해주세요.
            </p>
          )}
          {/* 전화번호 입력 필드와 인증 버튼 */}
          <div className="flex md:flex-row space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={13} // 하이픈 포함 길이, 수정 가능
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

          {/* 비밀번호 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-8 text-gray-500 bg-transparent"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="bg-transparent" />
              ) : (
                <AiOutlineEye className="bg-transparent" />
              )}
            </button>
            {/* 비밀번호 유효성 체크 아이콘 */}
            {formData.password &&
              (isPasswordValid(formData.password) ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>
          <div>
            <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />
            <p className="text-xs text-gray-500 mt-0 mb-0">
              8자 이상, 영문, 숫자 포함
            </p>
          </div>
          {/* 비밀번호 확인 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-8 text-gray-500 bg-transparent"
            >
              {showPasswordConfirm ? (
                <AiOutlineEyeInvisible className="bg-transparent" />
              ) : (
                <AiOutlineEye className="bg-transparent" />
              )}
            </button>
            {/* 비밀번호 일치 여부에 따른 아이콘 표시 */}
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          {/* 저축률 설정
          <div className="mt-4">
            <label className="text-gray-700 text-sm block mb-2">
              저축률 설정
            </label>
            <div className="flex items-center space-x-4 mt-2"> */}
          {/* 저축률 레인지 */}
          {/* <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-full"
              /> */}
          {/* 저축률 인풋 */}
          {/* <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-7 p-1 text-right border-none border-gray-300 rounded"
                disabled
              />
              <span className="!ml-0">%</span>
            </div>
          </div> */}
          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            회원가입
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

export default SignUpModal;
