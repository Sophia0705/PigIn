import React, { useState } from 'react';
import { loginAPI } from '../../../api/member/loginAPI';
import { useMemberStore } from '../../../store/memberStore';
import { X } from 'lucide-react';

// LoginModal 컴포넌트 정의
const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    isFindEmailModalOpen,
    closeLoginModal,
    openSignUpModal,
    openFindEmailModal,
    openFindPasswordModal,
    checkLoginStatus,
  } = useMemberStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handleSignUpClick = () => {
    closeLoginModal(); // 로그인 모달을 닫고
    openSignUpModal(); // 회원가입 모달을 연다
  };

  // 이메일 찾기 버튼 클릭 시 호출되는 함수
  const handleFindEmailClick = () => {
    console.log('이메일 찾기 버튼 클릭');
    closeLoginModal(); // 로그인 모달을 닫고
    openFindEmailModal(); // 이메일 찾기 모달을 열기
    console.log('isFindEmailModalOpen:', isFindEmailModalOpen);
  };

  // 비밀번호 찾기 버튼 클릭 시 호출되는 함수
  const handleFindPasswordClick = () => {
    closeLoginModal(); // 로그인 모달을 닫고
    openFindPasswordModal(); // 비밀번호 찾기 모달을 연다
  };

  // 로그인 폼 제출 처리 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 로그인 API 호출
      console.log('Login모달 : ', email, password);
      await loginAPI({ username: email, password });
      alert('로그인 성공했습니다!');

      // 로그인 상태를 업데이트하고 모달을 닫음
      checkLoginStatus(); // 로그인 상태 확인
      closeLoginModal(); // 로그인 모달 닫기

      // 현재 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isLoginModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20"
      onClick={closeLoginModal} // 배경 클릭 시 모달 닫기
    >
      {/* 모달 본체 */}
      <div
        className="relative bg-white rounded-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        {/* 닫기 버튼 */}
        <X
          onClick={closeLoginModal}
          className="absolute top-4 right-4 w-10 h-10 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        />

        {/* 모달 제목 */}
        <h3 className="text-center text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Login
        </h3>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 필드 */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >
              이메일 입력
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 상태 업데이트
              className="bg-gray-50 border border-gray-300 text-xl rounded-lg block w-full p-2.5"
              placeholder="ssafy@samsung.com"
              required
            />
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >
              비밀번호 입력
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
              className="bg-gray-50 border border-gray-300 text-xl rounded-lg block w-full p-2.5"
              required
            />
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
              onClick={handleSignUpClick} // 회원가입 모달로 이동
            >
              회원가입
            </button>
          </div>
          <div className="flex items-center mt-2">
            <p>기억나지 않으세요?</p>
            <button
              className="ml-2 text-md font-semibold text-blue-600 hover:underline"
              onClick={handleFindEmailClick} // 이메일 찾기 모달로 이동
            >
              아이디
            </button>
            <span className="mx-1">/</span>
            <button
              className="text-md font-semibold text-blue-600 hover:underline"
              onClick={handleFindPasswordClick} // 비밀번호 찾기 모달로 이동
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
