import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/memberStore';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle, FaUserMinus } from 'react-icons/fa'; // 탈퇴 아이콘 추가
import SuccessModal from './SuccessModal';
import WithdrawalModal from './WithDrawalModal'; // 회원 탈퇴 모달 추가

interface UpdateProfileModalProps {
  closeModal: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  closeModal,
}) => {
  const { formData, setFormData, loadUserData } = useStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [savingRate, setSavingRate] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // SuccessModal 상태 추가
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false); // 회원 탈퇴 모달 상태 추가

  useEffect(() => {
    loadUserData(); // 사용자 정보를 불러옴
    setSavingRate(formData.savingRate); // 사용자 정보에서 저장된 저축률 설정
  }, [loadUserData, formData.savingRate]);

  const isPasswordValid = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
    return regex.test(password);
  };

  const handleSavingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) {
      setSavingRate(parsedValue);
    } else if (value === '') {
      setSavingRate(0);
    }
  };

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

    // 정보 수정 완료 후 SuccessModal 띄우기
    setIsSuccessModalOpen(true); // 모달을 띄우기 위한 상태 변경
  };

  const isFormValid = () => {
    return (
      formData.name && isPasswordValid(formData.password) && isPasswordMatch
    );
  };

  // 탈퇴 모달을 여는 함수: 회원 정보 수정 모달을 닫고, 탈퇴 모달을 열도록 설정
  const openWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true); // 탈퇴 모달만 열림
  };

  // 탈퇴 모달을 닫는 함수
  const closeWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  return (
    <>
      <div
        className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={closeModal} // 모달 바깥을 클릭 시 닫힘
      >
        <div
          className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-[95%] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl max-h-full flex flex-col items-center animate-slide-up"
          onClick={(e) => e.stopPropagation()} // 모달 본체 클릭 시 이벤트 전파 차단
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
            회원 정보 수정
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 w-full"
          >
            {/* 이메일 입력 필드 */}
            <input
              type="email" // 이메일 입력 필드로 변경
              name="email" // 이메일 입력 필드에 맞는 name 속성으로 변경
              value={formData.email} // 이메일 값을 formData에서 가져옴
              onChange={handleChange} // 변경된 값을 상태로 업데이트
              placeholder="이메일"
              className="w-full p-2 border-none border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled
            />

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
            <p className="text-xs text-gray-500 mt-1">
              8자 이상, 영문, 숫자 포함
            </p>

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

            {/* 저축률 설정 */}
            <div className="mt-4">
              <label className="text-gray-700 text-sm block mb-2">
                저축률 설정
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={savingRate}
                  onChange={handleSavingRateChange}
                  className="w-full"
                />
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={savingRate}
                  onChange={handleSavingRateChange}
                  className="w-12 p-1 text-right border-none border-gray-300 rounded"
                />
                <span>%</span>
              </div>
            </div>

            {/* SuccessModal을 수정 완료 후 표시 */}
            {isSuccessModalOpen && (
              <SuccessModal
                setShowModal={() => {
                  setIsSuccessModalOpen(false);
                  closeModal(); // 모달을 닫음
                }}
                title={'회원 정보 수정\n완료되었습니다.'}
                buttonText="확인"
              />
            )}
            {/* 정보 수정 버튼 */}
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className={`w-full py-2 rounded ${
                  isFormValid()
                    ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#7ee9ce]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isFormValid()}
              >
                정보 수정
              </button>

              {/* 취소 버튼 */}
              <button
                type="button"
                className="w-full py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                onClick={closeModal}
              >
                취소
              </button>
            </div>

            {/* 회원 탈퇴 버튼: 클릭 시 회원 탈퇴 모달을 여는 함수 호출 */}
            <button
              onClick={openWithdrawalModal}
              className="absolute right-4 top-0 text-xs text-red-400 hover:text-red-600 flex items-center"
            >
              <FaUserMinus className="mr-1" /> {/* 회원 탈퇴 아이콘 */}
              탈퇴
            </button>
          </form>
        </div>
      </div>

      {/* WithdrawalModal을 표시 */}
      {isWithdrawalModalOpen && (
        <WithdrawalModal closeModal={closeWithdrawalModal} />
      )}
    </>
  );
};

export default UpdateProfileModal;
