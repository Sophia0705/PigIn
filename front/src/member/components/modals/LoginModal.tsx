import React, { useState } from 'react';
// import axiosInstance from '../../../api/axiosinstance'; // axiosInstance 가져오기
// import { useAuthStore } from '../../../store/AuthStore';
import { useStore } from '../../../store/memberStore';

// LoginModal 컴포넌트 정의
const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    isFindEmailModalOpen,
    closeLoginModal,
    openSignUpModal,
    openFindEmailModal,
    openFindPasswordModal,
    // checkLoginStatus,
  } = useStore();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // try {
    //   // axiosInstance를 사용하여 로그인 API 요청 (FormData 전송)
    //   const response = await axiosInstance.post('/member/login', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data', // FormData 전송을 위한 헤더 설정
    //     },
    //   });

    //   // 로그인 성공 시 access token을 로컬 스토리지에 저장
    //   const { accessToken } = response.data;
    //   localStorage.setItem('accessToken', accessToken);

    //   // 로그인 상태를 업데이트하고 모달을 닫음
    //   checkLoginStatus();
    //   console.log('로그인 성공!');
    //   alert('로그인 성공!');
    //   closeLoginModal();
    // } catch (error) {
    //   console.error('로그인 에러:', error);
    //   alert('로그인에 실패했습니다. 다시 시도해주세요.');
    // }
  };

  if (!isLoginModalOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음
  return (
    <div>
      {/* 모달 배경 */}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"></div>

      {/* 모달 본체 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          {/* 닫기 버튼 */}
          <button
            onClick={closeLoginModal}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            X
          </button>

          {/* 모달 제목 */}
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Login
          </h3>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 이메일 입력 필드 */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                이메일 입력
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // 상태 업데이트
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="ssafy@samsung.com"
                required
              />
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                비밀번호 입력
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
          </form>

          {/* 이메일 찾기 및 비밀번호 찾기, 회원가입 버튼 */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={handleFindEmailClick} // 이메일 찾기 모달로 이동
            >
              이메일 찾기
            </button>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={handleFindPasswordClick} // 비밀번호 찾기 모달로 이동
            >
              비밀번호 찾기
            </button>
            <button
              className="text-sm text-blue-600 hover:underline"
              // onClick={onOpenSignUpModal} // 회원가입 모달 열기
              onClick={handleSignUpClick} // 회원가입 모달로 이동
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
