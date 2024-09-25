import React, { useState } from 'react';
import { useStore } from '../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘
import axios from 'axios';
import SuccessModal from '../components/modals/SuccessModal'; // 성공 모달 컴포넌트
import FailModal from '../components/modals/FailModal'; // 실패 모달 컴포넌트

const SignUpPage: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옴
  const { formData, setFormData } = useStore();

  // 상태 관리 훅: 인증번호 전송 여부, 비밀번호 확인, 이메일 및 생년월일 유효성 상태 등
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 상태
  const [authenticationNumber, setAuthenticationNumber] = useState(''); // 인증번호
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 여부
  const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 유효성 상태
  const [isBirthValid, setIsBirthValid] = useState(true); // 생년월일 유효성 상태

  // const [savingRate, setSavingRate] = useState(0); // 저축률 상태

  // 이메일 유효성 검사 함수
  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 정규식
    return regex.test(email); // 유효성 검사 결과 반환
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

  // SMS 인증 요청 핸들러: 서버에 전화번호 전송하여 인증번호 요청
  const requestVerificationCode = async () => {
    try {
      const response = await fetch(`${BASE_URL}member/mms-number-compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });

      if (response.ok) {
        setIsCodeSent(true); // 인증번호 요청 성공 시 상태 변경
        setShowSuccessModal(true); // 인증번호 전송 모달 표시
      } else {
        setShowSuccessModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setShowFailModal(false);
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // formData를 새로운 객체로 복사
    const sanitizedFormData = { ...formData };

    // 하이픈을 제거한 전화번호로 변환
    sanitizedFormData.phoneNumber = formData.phoneNumber.replace(/-/g, '');

    // passwordConfirm 필드를 삭제 (타입 단언 사용)
    delete (sanitizedFormData as any).passwordConfirm;

    console.log('Submitted Data:', sanitizedFormData); // 하이픈 제거된 데이터 출력

    // 서버로 POST 요청 보내기
    try {
      const response = await axios.post(
        `${BASE_URL}member/sign-up`,
        sanitizedFormData
      );

      // 성공 시 처리
      console.log('회원가입 성공:', response.data);
      setSuccessMessage('회원가입이 완료되었습니다.');
      setShowSuccessModal(true); // 성공 모달 열기
    } catch (error) {
      // 오류가 발생한 경우, error를 string으로 변환하여 처리
      if (axios.isAxiosError(error)) {
        // AxiosError 타입으로 오류를 처리
        console.error(
          '회원가입 실패:',
          error.response ? error.response.data : error.message
        );
        setFailMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        setShowFailModal(true); // 실패 모달 열기
      } else {
        console.error('알 수 없는 오류:', error);
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
      formData.birth &&
      isBirthValid &&
      formData.phoneNumber.length === 13 &&
      // authenticationNumber.length === 6 &&
      isPasswordValid(formData.password) &&
      isPasswordMatch
    );
  };

  return (
    // 모달 배경
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      {/* 모달 본체 */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원가입
        </h2>
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
          {/* 이메일 입력 필드 */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일"
            className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
              isEmailValid
                ? 'border-gray-300 focus:ring-green-300'
                : 'border-red-500 focus:ring-red-500'
            } mb-1`}
            required
          />
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />
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
            <input
              type="text"
              value={authenticationNumber}
              onChange={handleAuthNumberChange}
              placeholder="인증번호 입력"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={6}
            />
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
          buttonText="다시 시도"
          buttonColor="bg-customRed"
          buttonHoverColor="hover:bg-[#FF2414]"
        />
      )}
    </div>
  );
};

export default SignUpPage;
