import React from 'react';
import { useNavigate } from 'react-router-dom';

// 모달 컴포넌트에 전달되는 props의 타입 정의
interface IsLoginModalProps {
  isOpen: boolean; // 모달이 열려있는지 여부를 나타내는 상태값
  onClose: () => void; // 모달을 닫기 위한 함수
  onOpenLoginModal: () => void; // LoginModal을 여는 함수
}

// 로그인 모달 컴포넌트
const IsLoginModal: React.FC<IsLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenLoginModal,
}) => {
  const navigate = useNavigate(); // 이전 페이지로 돌아가기 위한 useNavigate 훅 사용

  // 로그인 버튼 클릭 시 호출되는 함수 (LoginModal 열기)
  const handleLoginClick = () => {
    onClose(); // 현재 모달을 닫고
    onOpenLoginModal(); // LoginModal을 열기
  };

  // 취소 버튼 클릭 시 호출되는 함수 (이전 페이지로 리다이렉트)
  const handleCancelClick = () => {
    onClose(); // 모달을 닫음
    navigate(-1); // 이전 페이지로 이동
  };

  if (!isOpen) return null;

  return (
    // 모달의 배경 (화면 전체를 덮는 반투명 검정 배경)
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      {/* 모달 본체: 흰색 배경, 둥근 모서리, 그림자 효과 */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* 모달의 제목 */}
        <h2 className="text-lg font-semibold mb-4">로그인이 필요합니다</h2>
        {/* 모달의 내용 */}
        <p className="mb-6">로그인 페이지로 이동하시겠습니까?</p>
        {/* 버튼들 (취소 및 로그인) */}
        <div className="flex justify-end">
          {/* 취소 버튼 */}
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={handleCancelClick} // 취소 버튼 클릭 시 이전 페이지로 이동
          >
            취소
          </button>
          {/* 로그인 버튼 */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleLoginClick} // 로그인 버튼 클릭 시 LoginModal 띄우기
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsLoginModal;
