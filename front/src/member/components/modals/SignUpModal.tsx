import { useState } from 'react';
import { useMemberStore } from '../../../store/memberStore';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import SuccessModal from './SuccessModal';
import FailModal from './FailModal';
import {
  checkEmailDuplication,
  requestVerificationCode,
  verifyAuthenticationCode,
  signUp,
} from '../../../api/member/signUp';
import { X } from 'lucide-react';

const SignUpModal: React.FC = () => {
  const {
    openLoginModal,
    isSignUpModalOpen,
    closeSignUpModal,
    formData,
    setFormData,
  } = useMemberStore();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authenticationNumber, setAuthenticationNumber] = useState('');
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isBirthValid, setIsBirthValid] = useState(true);

  if (!isSignUpModalOpen) return null;

  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkEmailDuplicationHandler = async () => {
    try {
      await checkEmailDuplication(formData.email);
      setIsEmailAvailable(true);
      setSuccessMessage('사용 가능한 이메일입니다.');
      setShowSuccessModal(true);
    } catch (error) {
      setFailMessage('이미 사용 중인 이메일입니다.');
      setShowFailModal(true);
    }
  };

  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  const isBirthFormatValid = (birth: string): boolean => {
    const regex = /^(?:[0-9]{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(birth);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setIsEmailValid(isEmailFormatValid(value));
    }

    if (name === 'birth') {
      setIsBirthValid(isBirthFormatValid(value));
    }

    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/[^0-9]/g, '')
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormData({ ...formData, phoneNumber: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'password' || name === 'passwordConfirm') {
      setIsPasswordMatch(formData.password === passwordConfirm);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setPasswordConfirm(value);
    setIsPasswordMatch(formData.password === value);
  };

  const removeHyphenFromPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/-/g, '');
  };

  const requestVerificationCodeHandler = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );
      await requestVerificationCode(formData.name, sanitizedPhoneNumber);
      setIsCodeSent(true);
      setIsPhoneNumberVerified(false);
      setSuccessMessage('인증번호 요청이 성공하였습니다.');
      setShowSuccessModal(true);
    } catch (error) {
      setFailMessage('인증번호 요청이 실패하였습니다.');
      setShowFailModal(true);
    }
  };

  const verifyAuthenticationCodeHandler = async () => {
    try {
      const sanitizedPhoneNumber = removeHyphenFromPhoneNumber(
        formData.phoneNumber
      );
      await verifyAuthenticationCode(
        sanitizedPhoneNumber,
        authenticationNumber
      );
      setIsPhoneNumberVerified(true);
      setSuccessMessage('인증이 성공하였습니다.');
      setShowSuccessModal(true);
    } catch (error) {
      setFailMessage('인증이 실패하였습니다.');
      setShowFailModal(true);
    }
  };

  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { phoneNumber, name, email, birth, password } = formData;
    const sanitizedFormData = {
      phoneNumber: phoneNumber.replace(/-/g, ''),
      name,
      email,
      birth,
      password,
    };

    try {
      await signUp(sanitizedFormData);
      setSuccessMessage('회원가입이 완료되었습니다.');
      setShowSuccessModal(true);
      closeSignUpModal();
      openLoginModal();
    } catch (error) {
      setFailMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
      setShowFailModal(true);
    }
  };

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
    <div className="modal-content fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* 모달 본체 */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원가입
        </h2>
        <X
          onClick={closeSignUpModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        />
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
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
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
              onClick={checkEmailDuplicationHandler}
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

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              className={`w-full p-2 border-b ${
                isEmailValid ? 'border-gray-300' : 'border-red-500'
              } focus:outline-none focus:border-green-300`}
              required
            />
            {!isEmailValid && (
              <p className="text-xs text-red-500 mt-1">
                유효한 이메일 주소를 입력해주세요.
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              placeholder="생년월일 (예: 000101)"
              className={`w-full p-2 border-b ${
                isBirthValid ? 'border-gray-300' : 'border-red-500'
              } focus:outline-none focus:border-green-300`}
            />
            {!isBirthValid && (
              <p className="text-xs text-red-500 mt-1">
                유효한 생년월일을 입력해주세요.
              </p>
            )}
          </div>

          <div className="flex space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              maxLength={13}
            />
            <button
              type="button"
              onClick={requestVerificationCodeHandler}
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
                onClick={verifyAuthenticationCodeHandler} // 인증번호 검증 핸들러 호출
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
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formData.password &&
              (isPasswordValid(formData.password) ? (
                <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
              ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            8자 이상, 영문, 숫자 포함
          </p>

          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPasswordConfirm ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
              ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
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
