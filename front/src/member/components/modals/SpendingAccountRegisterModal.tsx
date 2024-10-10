import React, { useState } from 'react';
import { useSpendingAccountStore } from '../../../store/SpendingAccountStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘
import { AiOutlineClose } from 'react-icons/ai'; // X 아이콘
import SuccessModal from './SuccessModal'; // 성공 모달 컴포넌트
import FailModal from './FailModal'; // 실패 모달 컴포넌트
import {
  authenticateInvestmentAccount,
  verifyTransferAuthentication,
  registerSpendingAccount,
} from '../../../api/member/accountAPI';
import SubmissionCompleteModal from './SubmissionCompleteModal';

const bankOptions = [
  '싸피뱅크',
  'KB국민은행',
  '신한은행',
  '하나은행',
  '우리은행',
  'NH농협은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  '카카오뱅크',
  '케이뱅크',
];

const SpendingAccountRegisterModal: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData, closeSpendingAccountRegisterModal } =
    useSpendingAccountStore();

  // 상태 관리
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 상태
  const [isAccountVerified, setIsAccountVerified] = useState(false); // 1원 인증 여부
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false); // 인증번호 입력 필드 표시 여부
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false); // 제출 완료 상태

  // 비밀번호 유효성 검사 함수
  const isPasswordValid = (password: string) => {
    // 최소 8자 이상, 영문자(대소문자), 숫자, 특수문자를 포함할 수 있음
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  // 계좌번호 입력 필드의 하이픈 자동 배치 함수
  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 문자 제거
    if (value.length <= 4) {
      setFormData({ accountNumber: value });
    } else if (value.length <= 8) {
      setFormData({ accountNumber: value.slice(0, 4) + '-' + value.slice(4) });
    } else if (value.length <= 12) {
      setFormData({
        accountNumber:
          value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8),
      });
    } else {
      setFormData({
        accountNumber:
          value.slice(0, 4) +
          '-' +
          value.slice(4, 8) +
          '-' +
          value.slice(8, 12) +
          '-' +
          value.slice(12, 16),
      });
    }
  };

  // 계좌번호 1원 인증 함수
  const handleAccountVerification = async () => {
    try {
      // 하이픈 제거 후 계좌번호 출력 및 인증 요청
      const accountNumberWithoutHyphen = formData.accountNumber.replace(
        /-/g,
        ''
      );
      console.log('1원 인증 정보 (하이픈 제거) : ', accountNumberWithoutHyphen);

      const isVerified = await authenticateInvestmentAccount(
        accountNumberWithoutHyphen
      );
      if (isVerified) {
        setIsAccountVerified(true);
        setIsCodeInputVisible(true);
        setSuccessMessage(
          '1원 인증 번호가 전송되었습니다. 계좌 내역을 확인하세요.'
        );
        setShowSuccessModal(true);
      } else {
        setFailMessage('계좌 인증에 실패했습니다. 계좌 번호를 확인해주세요.');
        setShowFailModal(true);
      }
    } catch (error) {
      setFailMessage('계좌 인증 중 오류가 발생했습니다. 다시 시도해주세요.');
      setShowFailModal(true);
    }
  };

  // 인증 확인 함수
  const handleVerificationSubmit = async () => {
    try {
      const isVerified = await verifyTransferAuthentication(
        formData.accountNumber.replace(/-/g, ''),
        verificationCode
      );
      if (isVerified) {
        setSuccessMessage('계좌 인증이 완료되었습니다.');
        setShowSuccessModal(true);
      } else {
        setFailMessage('인증번호가 올바르지 않습니다.');
        setShowFailModal(true);
      }
    } catch (error) {
      setFailMessage('인증 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setShowFailModal(true);
    }
  };

  // 계좌 등록 함수
  const handleRegisterAccount = async () => {
    try {
      // 하이픈 제거 후 계좌번호를 API에 전송
      const accountNumberWithoutHyphen = formData.accountNumber.replace(
        /-/g,
        ''
      );
      const isSuccess = await registerSpendingAccount(
        formData.bankName,
        accountNumberWithoutHyphen
      );

      if (isSuccess) {
        setSuccessMessage('소비 계좌가 성공적으로 등록되었습니다.');
        setIsSubmissionComplete(true);
      } else {
        setFailMessage('계좌 등록에 실패했습니다. 다시 시도해주세요.');
        setShowFailModal(true);
      }
    } catch (error) {
      setFailMessage('계좌 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      setShowFailModal(true);
    }
  };

  // 입력 필드가 변경될 때 호출되는 핸들러 함수
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value }); // 상태 업데이트

    // 비밀번호 확인 필드와 비교하여 일치하는지 확인
    if (name === 'password' || name === 'passwordConfirm') {
      setIsPasswordMatch(formData.password === passwordConfirm);
    }
  };

  // 비밀번호 필드 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ password: e.target.value });
  };

  // 비밀번호 확인 필드 입력 핸들러
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setPasswordConfirm(value);
    setIsPasswordMatch(formData.password === value);
  };

  // 폼 제출 시 호출되는 핸들러 함수 (계좌 등록 처리)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작을 방지하여 페이지 새로고침을 막습니다.

    if (!isPasswordMatch) {
      setFailMessage('비밀번호가 일치하지 않습니다.');
      setShowFailModal(true);
      return;
    }

    console.log('계좌 등록 정보:', formData);
    handleRegisterAccount(); // 계좌 등록 함수 호출
  };

  // 모든 입력 필드가 올바르게 채워졌는지 확인하는 함수
  const isFormValid = () => {
    return (
      formData.name &&
      formData.bankName &&
      formData.accountNumber &&
      isAccountVerified && // 계좌 인증 여부 확인
      formData.password &&
      passwordConfirm &&
      isPasswordMatch &&
      isPasswordValid(formData.password)
    );
  };

  const handleSuccessModalClose = () => {
    window.location.reload();
  };

  return (
    <div
      className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
      onClick={closeSpendingAccountRegisterModal}
    >
      {/* 모달 본체 */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          소비 계좌 등록
        </h2>
        {/* X 버튼 추가 */}
        <button
          onClick={closeSpendingAccountRegisterModal}
          className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-900"
        >
          <AiOutlineClose />
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 이름 입력 필드 */}
          {/* <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          /> */}
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
          {/* 은행 선택 필드 */}
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full py-2 px-1 !mt-1 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="">은행 선택</option>
            {bankOptions.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>

          <div className="relative flex items-center space-x-2 w-full">
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="계좌번호"
              className="flex-1 p-2 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0 focus:border-green-300" // 밑줄 추가
              maxLength={19}
            />
            <button
              type="button"
              onClick={handleAccountVerification}
              className={`px-3 py-2 rounded w-auto justify-center ${
                isCodeInputVisible
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 요청 완료 시 회색으로 변경
                  : formData.accountNumber
                    ? 'bg-[#9CF8E1] text-gray-900'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formData.accountNumber}
            >
              {isCodeInputVisible ? '요청 완료' : '1원 인증'}
            </button>
          </div>

          <div className="relative flex items-center space-x-2 w-full">
            {isCodeInputVisible && (
              <>
                <input
                  type="text"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호"
                  className="flex-1 p-2 border-b border-gray-300 rounded-none focus:outline-none focus:ring-0 focus:border-green-300" // 밑줄 추가
                />
                <button
                  type="button"
                  onClick={handleVerificationSubmit}
                  className={`px-3 py-2 rounded ${
                    isAccountVerified
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // 인증 완료 시 회색으로 변경
                      : 'bg-[#9CF8E1] text-gray-700'
                  }`}
                  disabled={isAccountVerified} // 인증 완료 시 버튼 비활성화
                >
                  {isAccountVerified ? '확인 완료' : '인증 확인'}
                </button>
              </>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-8 text-gray-500 bg-transparent"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="bg-transparent" />
              ) : (
                <AiOutlineEye className="bg-transparent" />
              )}
            </button>
            {/* 비밀번호 유효성 체크 아이콘 */}
            {formData.password &&
              (isPasswordValid(formData.password) ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
          {/* 비밀번호 확인 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-8 text-gray-500 bg-transparent"
            >
              {showPasswordConfirm ? (
                <AiOutlineEyeInvisible className="bg-transparent" />
              ) : (
                <AiOutlineEye className="bg-transparent" />
              )}
            </button>
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
          {/* 계좌 등록 버튼 */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            계좌 등록
          </button>
        </form>
      </div>
      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          setShowModal={setShowSuccessModal}
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
      {/* 제출 성공 모달 */}
      {isSubmissionComplete && (
        <SubmissionCompleteModal
          onConfirm={handleSuccessModalClose}
          title={successMessage}
        />
      )}
    </div>
  );
};

export default SpendingAccountRegisterModal;
