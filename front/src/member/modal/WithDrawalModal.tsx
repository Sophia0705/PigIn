import React, { useState } from 'react';
import { useStore } from '../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

const WithdrawalModal: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData } = useStore();

  // 상태 관리
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 상태
  const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 유효성 상태

  // 이메일 유효성 검사 함수
  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단한 이메일 정규식
    return regex.test(email);
  };

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

    // 이메일 유효성 검사
    if (name === 'email') {
      setIsEmailValid(isEmailFormatValid(value));
    }

    setFormData({ ...formData, [name]: value });

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

  // 폼 제출 시 호출되는 핸들러 함수 (회원탈퇴 처리)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작을 방지하여 페이지 새로고침을 막습니다.
    if (!isPasswordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('탈퇴 정보:', formData.email, formData.password);
    // 회원탈퇴 API 요청을 여기에 추가
    alert('회원 탈퇴가 완료되었습니다.');
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      isEmailValid &&
      formData.email &&
      formData.password &&
      passwordConfirm &&
      isPasswordMatch &&
      isPasswordValid(formData.password)
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      {/* 모달 본체 */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원 탈퇴
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
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
          {!isEmailValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 이메일 주소를 입력해주세요.
            </p>
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
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>

          {/* 회원 탈퇴 버튼 */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            회원 탈퇴
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;
