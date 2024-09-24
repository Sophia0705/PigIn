import React from 'react';

// 모달 창을 닫는 함수를 props로 전달받는 인터페이스 정의
interface InvestmentAccountCompleteModalProps {
  setShowModal: (show: boolean) => void; // 모달의 열림/닫힘 상태를 제어하는 함수
}

// 회원가입 완료 후 투자 계좌 개설 완료 모달 컴포넌트 정의
const SignUpCompleteModal: React.FC<InvestmentAccountCompleteModalProps> = ({
  setShowModal, // 부모 컴포넌트에서 전달받은 상태 변경 함수
}) => {
  return (
    // 모달 창의 배경 설정 (화면 전체를 덮는 반투명 배경)
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 본체: 흰색 배경, 둥근 모서리, 그림자 효과 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {/* 모달 제목 */}
        <h2 className="text-xl font-bold mt-5 mb-10 text-center">
          투자 계좌가 개설되었습니다.
        </h2>

        {/* 확인 버튼을 클릭하면 모달을 닫는 함수 호출 */}
        <button
          onClick={() => setShowModal(false)} // 버튼 클릭 시 모달을 닫는 함수 호출
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600" // 버튼 스타일 (초록색 배경, 흰색 글자)
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default SignUpCompleteModal;
