import React, { useState } from "react";
import { useStore } from "../../store/memberStore"; // Zustand 스토어에서 formData와 setFormData 가져옴
import SignUpForm from "../components/SignUpForm"; // 회원가입 폼 컴포넌트
import VerificationModal from "../modal/VerificationModal"; // 인증번호 전송 후 보여지는 모달 컴포넌트

// 회원가입 모달 컴포넌트
const SignUpModal: React.FC = () => {
  // Zustand 스토어에서 formData와 setFormData 가져옴
  const { formData, setFormData } = useStore();

  // 모달 표시 여부 상태
  const [showModal, setShowModal] = useState(false);

  // 인증 코드 전송 여부 상태
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 입력된 인증번호 상태
  const [authenticationNumber, setAuthenticationNumber] = useState("");

  // 인증번호 입력 필드의 값이 변경될 때 호출되는 함수
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value); // 입력한 인증번호를 상태에 저장
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f] overflow-y-auto">
      {/* 모달 본체: 흰색 배경, 패딩, 그림자, 모서리 둥글게 처리 */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* 회원가입 제목 */}
        <h2 className="text-xl font-bold mb-6 text-center">회원가입</h2>

        {/* 회원가입 폼 컴포넌트 */}
        <SignUpForm
          formData={formData} // Zustand에서 가져온 formData 전달
          setFormData={setFormData} // Zustand에서 상태 변경 함수 전달
          authenticationNumber={authenticationNumber} // 인증번호 상태 전달
          handleAuthNumberChange={handleAuthNumberChange} // 인증번호 변경 핸들러 전달
          isCodeSent={isCodeSent} // 인증번호 전송 여부 상태 전달
        />

        {/* 인증번호 전송 모달 컴포넌트 */}
        <VerificationModal
          showModal={showModal} // 모달 표시 여부 상태 전달
          setShowModal={setShowModal} // 모달 표시 여부 상태 변경 함수 전달
        />
      </div>
    </div>
  );
};

export default SignUpModal;
