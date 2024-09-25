import React, { useState } from 'react';
import { useStore } from '../../store/SpendingAccountStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

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

const SpendingAccountRegister: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData } = useStore();

  // 상태 관리
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가리기/보이기 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 비밀번호 확인 가리기/보이기 상태
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // 비밀번호 일치 상태
  const [isAccountVerified, setIsAccountVerified] = useState(false); // 1원 인증 여부

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
    } else {
      setFormData({
        accountNumber:
          value.slice(0, 4) +
          '-' +
          value.slice(4, 8) +
          '-' +
          value.slice(8, 14),
      });
    }
  };

  // 계좌번호 1원 인증 함수
  const handleAccountVerification = () => {
    // 실제 1원 인증 API 요청 로직을 여기에 추가
    setIsAccountVerified(true); // 1원 인증 성공 상태로 설정
    alert('1원 인증이 완료되었습니다.');
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
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('계좌 등록 정보:', formData);
    // 계좌 등록 API 요청을 여기에 추가
    alert('소비 계좌가 성공적으로 등록되었습니다.');
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      {/* 모달 본체 */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          소비 계좌 등록
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 w-full"
        >
          {/* 이름 입력 필드 */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
          {/* 은행 선택 필드 */}
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            style={{
              fontSize: '14px', // 선택지의 글자 크기를 줄여서 옵션 리스트의 크기를 줄임
              padding: '4px', // 패딩을 줄여서 선택지 항목의 높이를 줄임
            }}
          >
            <option value="">은행 선택</option>
            {bankOptions.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />

          {/* 계좌번호 입력 필드 및 1원 인증 버튼 */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleAccountNumberChange}
              placeholder="계좌번호"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              maxLength={14} // 예시: 하이픈 포함 최대 14자리로 제한
            />
            <button
              type="button"
              onClick={handleAccountVerification}
              className={`px-3 py-2 rounded w-7/33 justify-center ${
                formData.accountNumber
                  ? 'bg-[#9CF8E1] text-gray-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!formData.accountNumber}
            >
              인증
            </button>
          </div>
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
          {/* 인증번호 입력 필드 */}
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            placeholder="인증번호"
            className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <hr className="w-full mx-auto border-t border-gray-300 relative top-[-11px]" />
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
    </div>
  );
};

export default SpendingAccountRegister;
