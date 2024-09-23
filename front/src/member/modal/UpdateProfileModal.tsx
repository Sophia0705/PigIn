import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/memberStore'; // Zustand로 관리되는 상태를 가져옴
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 눈 모양 아이콘
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 확인 아이콘 및 일치하지 않을 때 빨간 체크 아이콘

const UpdateProfileModal: React.FC = () => {
  // Zustand 스토어에서 상태와 상태 변경 함수를 가져옵니다.
  const { formData, setFormData, loadUserData } = useStore();

  // 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [savingRate, setSavingRate] = useState(0);

  // 비밀번호 유효성 검사 함수
  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value.startsWith('0') && value.length > 1 && !value.includes('.')) {
      value = value.slice(1);
    }

    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) {
      setSavingRate(parsedValue);
    } else if (value === '') {
      setSavingRate(0);
    }
  };

  // 회원 정보 수정 페이지가 렌더링될 때 기존 사용자 정보를 로드
  useEffect(() => {
    loadUserData(); // 상태에 저장된 사용자 데이터를 불러옴
    setSavingRate(formData.savingRate); // 사용자 저장된 저축률을 설정
  }, [loadUserData, formData.savingRate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Data:', formData);
  };

  const isFormValid = () => {
    return (
      formData.name && isPasswordValid(formData.password) && isPasswordMatch
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0e2b2f]">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          회원 정보 수정
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
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          {/* 비밀번호 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="새 비밀번호"
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
            {formData.password &&
              (isPasswordValid(formData.password) ? (
                <FaCheckCircle className="absolute right-2 top-2 text-green-500" />
              ) : (
                <FaTimesCircle className="absolute right-2 top-2 text-red-500" />
              ))}
          </div>

          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          {/* 비밀번호 확인 입력 필드 */}
          <div className="relative flex items-center">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="새 비밀번호 확인"
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
          <hr className="w-[330px] mx-auto border-t border-gray-300 relative top-[-11px]" />

          {/* 저축률 설정 */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm block mb-2">
              저축률 설정
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={savingRate}
                onChange={handleSavingRateChange}
                className="w-7 p-1 text-right border-none border-gray-300 rounded"
                disabled
              />
              <span className="!ml-0">%</span>
            </div>
          </div>

          {/* 정보 수정 버튼 */}
          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isFormValid()
                ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#9CF8E1]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            정보 수정
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
