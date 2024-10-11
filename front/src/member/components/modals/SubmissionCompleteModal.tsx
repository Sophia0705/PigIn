import React from 'react';

// SubmissionCompleteModal 컴포넌트의 props 타입을 정의
interface SubmissionCompleteModalProps {
  onConfirm: () => void; // 확인 버튼 클릭 시 실행될 함수
  title: string; // 모달의 제목을 표시할 문자열
}

// SubmissionCompleteModal 컴포넌트를 정의
const SubmissionCompleteModal: React.FC<SubmissionCompleteModalProps> = ({
  onConfirm, // 부모 컴포넌트에서 전달받은 확인 클릭 함수
  title, // 모달의 제목 텍스트
}) => {
  return (
    // 모달의 배경 (화면 전체를 덮는 검은 반투명 배경)
    <div className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      {/* 모달 본체: 흰색 배경에 그림자와 패딩, 둥근 모서리 스타일 */}
      <div
        className="modal-content bg-white p-6 rounded-lg shadow-lg w-80 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        {/* 모달의 제목을 표시, 줄바꿈을 허용하는 스타일 적용 */}
        <h2
          className="text-xl font-bold mt-5 mb-10 text-center"
          style={{ whiteSpace: 'pre-wrap' }} // 텍스트 내에서 줄바꿈을 유지
        >
          {title} {/* 부모로부터 전달받은 제목 표시 */}
        </h2>

        {/* 모달을 닫는 버튼 */}
        <button
          onClick={onConfirm} // 부모 컴포넌트에서 전달받은 함수 호출
          className="w-full py-2 text-gray-700 rounded bg-customAqua hover:bg-[#7ee9ce]" // 고정된 색상
        >
          확인 {/* 항상 "확인" 텍스트 */}
        </button>
      </div>
    </div>
  );
};

export default SubmissionCompleteModal;
