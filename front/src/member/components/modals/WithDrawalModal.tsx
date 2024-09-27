// import React, { useState } from 'react';
// import { useStore } from '../../../store/memberStore';
// import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import SuccessModal from './SuccessModal';

// interface WithdrawalModalProps {
//   closeModal: () => void;
// }

// const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ closeModal }) => {
//   const { formData, setFormData } = useStore();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
//   const [passwordConfirm, setPasswordConfirm] = useState('');
//   const [isPasswordMatch, setIsPasswordMatch] = useState(false);
//   const [isEmailValid, setIsEmailValid] = useState(true);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const isEmailFormatValid = (email: string) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const isPasswordValid = (password: string) => {
//     const regex =
//       /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]{8,}$/;
//     return regex.test(password);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     if (name === 'email') {
//       setIsEmailValid(isEmailFormatValid(value));
//     }

//     setFormData({ ...formData, [name]: value });

//     if (name === 'password' || name === 'passwordConfirm') {
//       setIsPasswordMatch(formData.password === passwordConfirm);
//     }
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, password: e.target.value });
//   };

//   const handlePasswordConfirmChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = e.target;
//     setPasswordConfirm(value);
//     setIsPasswordMatch(formData.password === value);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isPasswordMatch) {
//       alert('비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     console.log('탈퇴 정보:', formData.email, formData.password);
//     setIsSuccess(true);
//   };

//   const isFormValid = () => {
//     return (
//       isEmailValid &&
//       formData.email &&
//       formData.password &&
//       passwordConfirm &&
//       isPasswordMatch &&
//       isPasswordValid(formData.password)
//     );
//   };

//   return (
//     <div className="modal-content fixed inset-0 flex items-center justify-center z-50">
//       {/* 백드롭 */}
//       <div
//         className="fixed inset-0 bg-black bg-opacity-50"
//         onClick={closeModal}
//       ></div>

//       {/* SuccessModal 표시 */}
//       {isSuccess && (
//         <SuccessModal
//           setShowModal={setIsSuccess}
//           title="회원 탈퇴가 완료되었습니다."
//           buttonText="확인"
//         />
//       )}

//       {/* 탈퇴 모달 본체 */}
//       {!isSuccess && (
//         <div
//           className="bg-white rounded-lg shadow-lg w-full max-w-sm z-50"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
//             회원 탈퇴(보유 주식 x, 투자 계좌 잔고 0일 때 가능)
//           </h2>

//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col space-y-3 w-full"
//           >
//             {/* 이메일 입력 필드 */}
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="이메일"
//               className={`w-full p-2 border-none rounded focus:outline-none focus:ring-2 ${
//                 isEmailValid
//                   ? 'border-gray-300 focus:ring-green-300'
//                   : 'border-red-500 focus:ring-red-500'
//               } mb-1`}
//               disabled
//             />
//             {!isEmailValid && (
//               <p className="text-xs text-red-500 mt-1">
//                 유효한 이메일 주소를 입력해주세요.
//               </p>
//             )}

//             {/* 비밀번호 입력 필드 */}
//             <div className="relative flex items-center">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="이메일"
//                 className={`w-full p-2 border ${
//                   isEmailValid ? 'border-gray-300' : 'border-red-500'
//                 } rounded focus:outline-none focus:ring-2 focus:ring-green-300`}
//                 required
//               />
//               {!isEmailValid && (
//                 <p className="text-xs text-red-500 mt-1">
//                   유효한 이메일 주소를 입력해주세요.
//                 </p>
//               )}

//               {/* 비밀번호 입력 필드 */}
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handlePasswordChange}
//                   placeholder="비밀번호"
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-2 text-gray-500"
//                 >
//                   {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//                 </button>
//                 {formData.password &&
//                   (isPasswordValid(formData.password) ? (
//                     <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
//                   ) : (
//                     <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
//                   ))}
//               </div>
//               <p className="text-xs text-gray-500">8자 이상, 영문, 숫자 포함</p>

//               {/* 비밀번호 확인 입력 필드 */}
//               <div className="relative">
//                 <input
//                   type={showPasswordConfirm ? 'text' : 'password'}
//                   value={passwordConfirm}
//                   onChange={handlePasswordConfirmChange}
//                   placeholder="비밀번호 확인"
//                   className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
//                   className="absolute right-2 top-2 text-gray-500"
//                 >
//                   {showPasswordConfirm ? (
//                     <AiOutlineEyeInvisible />
//                   ) : (
//                     <AiOutlineEye />
//                   )}
//                 </button>
//                 {passwordConfirm &&
//                   (isPasswordMatch ? (
//                     <FaCheckCircle className="absolute right-8 top-3 text-green-500" />
//                   ) : (
//                     <FaTimesCircle className="absolute right-8 top-3 text-red-500" />
//                   ))}
//               </div>

//               <div className="flex space-x-2 mt-4">
//                 {/* 회원 탈퇴 버튼 */}
//                 <button
//                   type="submit"
//                   className={`w-1/2 py-2 rounded ${
//                     isFormValid()
//                       ? 'bg-[#FF2414] text-white font-semibold hover:bg-[#E61E05]'
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                   disabled={!isFormValid()}
//                 >
//                   회원 탈퇴
//                 </button>

//                 {/* 취소 버튼 */}
//                 <button
//                   type="button"
//                   className="w-1/2 py-2 rounded bg-[#9CF8E1] text-gray-900 hover:bg-[#7ee9ce]"
//                   onClick={closeModal}
//                 >
//                   취소
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WithdrawalModal;
