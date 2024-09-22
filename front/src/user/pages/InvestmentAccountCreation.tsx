import React, { useState } from 'react';
import { useStore } from '../../store/InvestmentAccountStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

const InvestmentAccountCreation: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData } = useStore();

  // 상태 관리
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authenticationNumber, setAuthenticationNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 상태
  const [savingRate, setSavingRate] = useState<number>(0); // 저축률 상태
  const [savingRateValid, setSavingRateValid] = useState(true); // 저축률 유효성 상태

  // 비밀번호 유효성 검사 함수
  const isPasswordValid = (password: string) => {
    // 최소 8자 이상, 영문자(대소문자), 숫자, 특수문자를 포함할 수 있음
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

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

    // 비밀번호 확인 필드와 비교하여 일치하는지 확인
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
    setIsPasswordMatch(formData.password === value);
  };

  // 저축률 설정 핸들러 (게이지 바 및 입력 필드)
  const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 10) {
      setSavingRate(value);
      setSavingRateValid(true); // 유효한 값이면 valid
    } else {
      setSavingRateValid(false); // 유효하지 않은 값이면 invalid
    }
  };

  // SMS 인증 요청 핸들러
  const requestVerificationCode = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/member/mms-number-compare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
        }
      );

      if (response.ok) {
        setIsCodeSent(true); // 인증번호 요청 성공 시 상태 변경
        setShowModal(true); // 인증번호 전송 모달 표시
      } else {
        alert('인증번호 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 인증번호 확인 핸들러
  const verifyCode = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/member/mms-number-compare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authenticationNumber,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      if (response.ok) {
        alert('인증이 완료되었습니다.');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지, 페이지 새로고침 막기
    console.log('Submitted Data:', formData);
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.name &&
      formData.phoneNumber.length === 13 &&
      isPasswordValid(formData.password) &&
      isPasswordMatch &&
      savingRateValid
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          투자 계좌 개설
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          <div className="flex md:flex-row space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={13}
            />
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ${
                formData.phoneNumber.length === 13
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={formData.phoneNumber.length !== 13}
            >
              인증 요청
            </button>
          </div>
          <hr className="w-[240px] ml-0 border-t border-gray-300 relative top-[-12px]" />

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
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          <div className="mt-4">
            <label className="text-gray-700 text-sm block mb-2">
              저축률 설정
            </label>
            <div className="flex items-center space-x-4 mt-2">
              {/* range input for saving rate */}
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-full"
              />
              {/* number input for saving rate */}
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-8 p-1 text-right border-none border-gray-300 rounded"
              />
              <span className="!ml-0">%</span>
            </div>
            {!savingRateValid && (
              <p className="text-xs text-red-500 mt-1">
                저축률을 0에서 10 사이로 입력해주세요.
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-green-300 text-white font-semibold hover:bg-green-400'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            계좌 개설
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mt-5 mb-10">
              인증번호가 전송되었습니다.
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentAccountCreation;
