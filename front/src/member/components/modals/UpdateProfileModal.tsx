import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/memberStore';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import SuccessModal from './SuccessModal';

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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    loadUserData();
    setSavingRate(formData.savingRate);
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
    setIsSuccessModalOpen(true);
  };

  const isFormValid = () => {
    return (
      formData.name && isPasswordValid(formData.password) && isPasswordMatch
    );
  };

  return (
    <>
      <div className="modal-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              회원 정보 수정
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                className="w-full p-2 border border-gray-300 rounded"
                disabled
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="새 비밀번호"
                  className="w-full p-2 border border-gray-300 rounded"
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
              <p className="text-xs text-gray-500">8자 이상, 영문, 숫자 포함</p>

              <div className="relative">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="새 비밀번호 확인"
                  className="w-full p-2 border border-gray-300 rounded"
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

              <div>
                <label className="text-sm text-gray-700 block mb-2">
                  저축률 설정
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={savingRate}
                    onChange={handleSavingRateChange}
                    className="w-4/5"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={savingRate}
                    onChange={handleSavingRateChange}
                    className="w-1/5 p-1 text-right border border-gray-300 rounded"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className={`w-1/2 py-2 rounded ${
                    isFormValid()
                      ? 'bg-[#9CF8E1] text-gray-900 font-semibold hover:bg-[#7ee9ce]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isFormValid()}
                >
                  정보 수정
                </button>

                <button
                  type="button"
                  className="w-1/2 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                  onClick={closeModal}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isSuccessModalOpen && (
        <SuccessModal
          setShowModal={() => {
            setIsSuccessModalOpen(false);
            closeModal();
          }}
          title={'회원 정보 수정\n완료되었습니다.'}
          buttonText="확인"
        />
      )}
    </>
  );
};

export default UpdateProfileModal;
