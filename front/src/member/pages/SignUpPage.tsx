import { useState } from 'react';
import { useStore } from '../../store/memberStore';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SignUpPage: React.FC = () => {
  const { formData, setFormData } = useStore();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authenticationNumber, setAuthenticationNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isBirthValid, setIsBirthValid] = useState(true);

  const isEmailFormatValid = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  const isBirthFormatValid = (birth: string): boolean => {
    const regex = /^(?:[0-9]{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(birth);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setIsEmailValid(isEmailFormatValid(value));
    }

    if (name === 'birth') {
      setIsBirthValid(isBirthFormatValid(value));
    }

    if (name === 'phoneNumber') {
      const formattedValue = value
        .replace(/[^0-9]/g, '')
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormData({ ...formData, phoneNumber: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'password' || name === 'passwordConfirm') {
      setIsPasswordMatch(formData.password === passwordConfirm);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setPasswordConfirm(value);
    setIsPasswordMatch(formData.password === value);
  };

  const requestVerificationCode = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/member/mms-number-compare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
        }
      );

      if (response.ok) {
        setIsCodeSent(true);
        setShowModal(true);
      } else {
        alert('인증번호 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthenticationNumber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
  };

  const isFormValid = () => {
    return (
      formData.name &&
      isEmailValid &&
      formData.birth &&
      isBirthValid &&
      formData.phoneNumber.length === 13 &&
      authenticationNumber.length === 6 &&
      isPasswordValid(formData.password) &&
      isPasswordMatch
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e2b2f] p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[380px]">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
          />

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              className={`w-full p-2 border-b ${
                isEmailValid ? 'border-gray-300' : 'border-red-500'
              } focus:outline-none focus:border-green-300`}
              required
            />
            {!isEmailValid && (
              <p className="text-xs text-red-500 mt-1">
                유효한 이메일 주소를 입력해주세요.
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              placeholder="생년월일 (예: 000101)"
              className={`w-full p-2 border-b ${
                isBirthValid ? 'border-gray-300' : 'border-red-500'
              } focus:outline-none focus:border-green-300`}
            />
            {!isBirthValid && (
              <p className="text-xs text-red-500 mt-1">
                유효한 생년월일을 입력해주세요.
              </p>
            )}
          </div>

          <div className="flex space-x-2 items-center">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="전화번호 (예: 01012345678)"
              className="flex-1 p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              maxLength={13}
            />
            <button
              type="button"
              onClick={requestVerificationCode}
              className={`p-2 rounded ${
                formData.phoneNumber.length === 13
                  ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={formData.phoneNumber.length !== 13}
            >
              인증 요청
            </button>
          </div>

          {isCodeSent && (
            <input
              type="text"
              value={authenticationNumber}
              onChange={handleAuthNumberChange}
              placeholder="인증번호 입력"
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
              maxLength={6}
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formData.password &&
              (isPasswordValid(formData.password) ? (
                <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
              ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            8자 이상, 영문, 숫자 포함
          </p>

          <div className="relative">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPasswordConfirm ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
            {passwordConfirm &&
              (isPasswordMatch ? (
                <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
              ))}
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            회원가입
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-sm">
            <h2 className="text-xl font-bold mb-6 text-center">
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

export default SignUpPage;
