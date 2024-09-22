import React, { useState } from 'react';
import { useStore } from '../../store/SpendingAccountStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

const SpendingAccountRegister: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData } = useStore();

  // 상태 관리
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authenticationNumber, setAuthenticationNumber] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 입력 필드가 변경될 때 호출되는 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 1원 송금 인증 요청 핸들러
  const requestVerificationCode = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/account/send-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
          }),
        }
      );

      if (response.ok) {
        setIsCodeSent(true); // 인증번호 요청 성공 시 상태 변경
        setShowModal(true); // 인증번호 전송 모달 표시
      } else {
        alert('1원 송금 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 인증번호 입력 변경 핸들러
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  // 인증번호 확인 핸들러
  const verifyCode = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/account/verify-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authenticationNumber,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
          }),
        }
      );

      if (response.ok) {
        alert('인증이 완료되었습니다.');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 폼 제출 시 호출되는 핸들러 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    console.log('Submitted Data:', formData);
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.bankName &&
      formData.accountNumber &&
      authenticationNumber.length === 6
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          소비 계좌 등록
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="은행 이름"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="계좌 번호"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <div className="flex md:flex-row space-x-2 items-center">
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ${
                formData.bankName && formData.accountNumber
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formData.bankName || !formData.accountNumber}
            >
              1원 송금 요청
            </button>
          </div>

          {isCodeSent && (
            <input
              type="text"
              value={authenticationNumber}
              onChange={handleAuthNumberChange}
              placeholder="인증번호 입력"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={6}
            />
          )}

          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-green-300 text-white font-semibold hover:bg-green-400'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            계좌 등록
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mt-5 mb-10">
              인증번호가 전송되었습니다.
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingAccountRegister;
