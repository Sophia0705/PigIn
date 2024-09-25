import React, { useState } from 'react';
import { useStore } from '../../../store/memberStore';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import BirthInput from '../inputs/BirthInput';
import PhoneInput from '../inputs/PhoneInput';
import AuthNumberInput from '../inputs/AuthNumberInput';
import PasswordInput from '../inputs/PasswordInput';
import PasswordConfirmInput from '../inputs/PasswordConfirmInput';
import SuccessModal from '../modals/SuccessModal';
import FailModal from '../modals/FailModal';

const SignUpModal: React.FC = () => {
  const { formData, setFormData } = useStore();

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isBirthValid, setIsBirthValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setIsEmailValid(emailValid);
    }

    if (name === 'birth') {
      const birthValid =
        /^(?:[0-9]{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])$/.test(value);
      setIsBirthValid(birthValid);
    }

    if (name === 'phoneNumber' && value.length === 13) {
      setIsPhoneValid(true);
    }

    if (name === 'password') {
      const passwordValid =
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/.test(
          value
        );
      setIsPasswordValid(passwordValid);
    }

    if (name === 'passwordConfirm') {
      setIsPasswordMatch(value === formData.password);
    }
  };

  const handleVerifyClick = () => {
    setIsCodeSent(true);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowPasswordConfirm = () =>
    setShowPasswordConfirm(!showPasswordConfirm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 폼 제출 처리 로직
    if (isFormValid()) {
      setShowSuccessModal(true); // 성공 모달 표시
    } else {
      setShowFailModal(true); // 실패 모달 표시
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      isEmailValid &&
      isBirthValid &&
      isPhoneValid &&
      isCodeSent &&
      isPasswordValid &&
      isPasswordMatch
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      {/* 모달 본체 */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원가입
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          <NameInput value={formData.name} onChange={handleInputChange} />

          <EmailInput
            value={formData.email}
            onChange={handleInputChange}
            isValid={isEmailValid}
          />
          {!isEmailValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 이메일 주소를 입력해주세요.
            </p>
          )}

          <BirthInput
            value={formData.birth}
            onChange={handleInputChange}
            isValid={isBirthValid}
          />
          {!isBirthValid && (
            <p className="text-xs text-red-500 mt-1">
              유효한 생년월일을 입력해주세요.
            </p>
          )}

          <PhoneInput
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onVerifyClick={handleVerifyClick}
            isValid={isPhoneValid}
          />

          {isCodeSent && (
            <AuthNumberInput
              value={formData.authNumber}
              onChange={handleInputChange}
            />
          )}

          <PasswordInput
            value={formData.password}
            onChange={handleInputChange}
            isValid={isPasswordValid}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
          />

          <PasswordConfirmInput
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            isMatch={isPasswordMatch}
            showPasswordConfirm={showPasswordConfirm}
            toggleShowPasswordConfirm={toggleShowPasswordConfirm}
          />

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#7ee9ce]'
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
          title="회원가입이 완료되었습니다."
          buttonText="확인"
          buttonColor="bg-customAqua"
          buttonHoverColor="hover:bg-[#7ee9ce]"
        />
      )}

      {/* 실패 모달 */}
      {showFailModal && (
        <FailModal
          setShowModal={setShowFailModal}
          title="회원가입에 실패했습니다."
          buttonText="다시 시도"
          buttonColor="bg-customRed"
          buttonHoverColor="hover:bg-[#FF2414]"
        />
      )}
    </div>
  );
};

export default SignUpModal;
