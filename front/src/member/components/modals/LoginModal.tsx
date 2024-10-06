import React, { useState } from 'react';
import { loginAPI } from '../../../api/member/loginAPI';
import { useMemberStore } from '../../../store/memberStore';
import { X } from 'lucide-react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import FailModal from './FailModal';
import SuccessModal from './SuccessModal';

const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    openSignUpModal,
    openFindEmailModal,
    openFindPasswordModal,
    checkLoginStatus,
  } = useMemberStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달 상태
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지

  // 비밀번호 유효성 검사 함수
  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  const handleSignUpClick = () => {
    closeLoginModal();
    openSignUpModal();
  };

  const handleFindEmailClick = () => {
    closeLoginModal();
    openFindEmailModal();
  };

  const handleFindPasswordClick = () => {
    closeLoginModal();
    openFindPasswordModal();
  };

  // 로그인 처리 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await loginAPI({ username: email, password });
      setSuccessMessage('로그인 성공하였습니다!');
      setShowSuccessModal(true);
      checkLoginStatus();
    } catch (error) {
      console.error('로그인 에러:', error);
      setFailMessage('로그인 실패하였습니다.');
      setShowFailModal(true);
    }
  };

  // 성공 모달에서 확인 버튼을 누르면 페이지 새로고침
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    closeLoginModal(); // 모달을 닫은 후에 로그인 모달도 닫음
    window.location.reload(); // 페이지 새로고침
  };

  if (!isLoginModalOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20"
      onClick={closeLoginModal}
    >
      <div
        className="relative bg-white rounded-lg w-full max-w-md px-6 py-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <X
          onClick={closeLoginModal}
          className="absolute top-7 right-4 w-10 h-10 text-gray-400 hover:text-gray-600"
        />

        {/* 모달 제목 */}
        <h3 className="text-center text-4xl font-bold text-gray-900">Login</h3>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 필드 */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-medium text-gray-900"
            >
              이메일 입력
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xl rounded-lg block w-full p-2.5"
              placeholder="ssafy@samsung.com"
              required
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium text-gray-900"
            >
              비밀번호 입력
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xl rounded-lg block w-full p-2.5 pr-12" // pr-12을 추가하여 오른쪽 여백 확보
              required
            />
            {/* 비밀번호 보이기/숨기기 아이콘 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {/* 비밀번호 유효성 확인 아이콘 */}
            {password &&
              (isPasswordValid(password) ? (
                <FaCheckCircle className="absolute right-10 top-2/4 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-10 top-2/4 text-red-500" />
              ))}
            <p className="text-xs text-gray-500 mt-1">
              8자 이상, 영문, 숫자 포함
            </p>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="text-2xl bg-customAqua font-bold rounded-lg w-full h-[60px] px-5 py-2.5 text-center"
          >
            로그인
          </button>
        </form>

        {/* 이메일 찾기 및 비밀번호 찾기, 회원가입 버튼 */}
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center">
            <p>처음 이용하시나요?</p>
            <button
              className="ml-2 text-md font-semibold text-blue-600 hover:underline"
              onClick={handleSignUpClick}
            >
              회원가입
            </button>
          </div>
          <div className="flex items-center mt-2">
            <p>기억나지 않으세요?</p>
            <button
              className="ml-2 text-md font-semibold text-blue-600 hover:underline"
              onClick={handleFindEmailClick}
            >
              아이디
            </button>
            <span className="mx-1">/</span>
            <button
              className="text-md font-semibold text-blue-600 hover:underline"
              onClick={handleFindPasswordClick}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          setShowModal={handleSuccessModalClose}
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

export default LoginModal;
