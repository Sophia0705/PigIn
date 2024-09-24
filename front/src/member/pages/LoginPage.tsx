import React, { useState } from 'react';

// LoginModal 컴포넌트 정의
const LoginModal: React.FC = () => {
  // 모달 열림/닫힘 상태를 관리하는 useState 훅
  const [isOpen, setIsOpen] = useState(false);

  // 모달을 열거나 닫는 함수
  const toggleModal = () => {
    setIsOpen(!isOpen); // isOpen 상태를 반전시켜 모달을 열거나 닫음
  };

  return (
    <div>
      {/* 모달 열기 버튼 */}
      <button
        onClick={toggleModal} // 클릭 시 모달을 열거나 닫음
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        로그인 테스트용
      </button>

      {/* 모달 */}
      {isOpen && ( // isOpen이 true일 때만 모달을 보여줌
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 모달 배경 */}
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50"></div>

          {/* 모달 본체 */}
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700 w-full max-w-md p-6 z-10">
            {/* 닫기 버튼 */}
            <button
              onClick={toggleModal} // 클릭 시 모달을 닫음
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              X
            </button>

            {/* 모달 제목 */}
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Login
            </h3>

            {/* 로그인 폼 */}
            <form>
              {/* 이메일 입력 필드 */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  이메일 입력
                </label>
                <input
                  type="email" // 이메일 형식의 입력 필드
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="ssafy@samsung.com" // 이메일 입력 예시
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
                  type="password" // 비밀번호 형식의 입력 필드
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit" // 폼 제출 버튼
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
