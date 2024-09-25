import React from 'react';

// 모달 컴포넌트에 전달되는 props의 타입 정의
interface SpendingAccountCompleteModalProps {
  setShowModal: (show: boolean) => void; // 모달을 닫기 위한 상태 업데이트 함수
}

// 소비 계좌 개설 완료를 알리는 모달 컴포넌트
const SignUpCompleteModal: React.FC<SpendingAccountCompleteModalProps> = ({
  setShowModal,
}) => {
  return (
    // 화면 전체를 덮는 반투명 검정 배경
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 본체: 흰색 배경, 둥근 모서리, 그림자 효과 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {/* 모달의 제목 */}
        <h2 className="text-xl font-bold mt-5 mb-10 text-center">
          소비 계좌가 개설되었습니다.
        </h2>
        {/* 확인 버튼 */}
        <button
          onClick={() => setShowModal(false)} // 버튼 클릭 시 모달을 닫음
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SignUpCompleteModal;
