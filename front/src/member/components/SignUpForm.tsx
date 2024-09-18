import React from "react";
import AuthRequestButton from "./AuthRequestButton";
import PasswordField from "./PasswordField";
import PasswordConfirmField from "./PasswordConfirmField";
import AuthCodeInput from "./AuthCodeInput";

interface FormData {
  name: string;
  email: string;
  birth: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
}

interface SignUpFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  authenticationNumber: string;
  handleAuthNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCodeSent: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  setFormData,
  authenticationNumber,
  handleAuthNumberChange,
  isCodeSent,
}) => {
  return (
    <form className="flex flex-col space-y-3 md:space-y-4 w-full">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="이름"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <AuthRequestButton
        phoneNumber={formData.phoneNumber}
        requestVerificationCode={() => {
          /* 인증 요청 로직 */
        }}
      />
      {isCodeSent && (
        <AuthCodeInput
          authenticationNumber={authenticationNumber}
          handleAuthNumberChange={handleAuthNumberChange}
        />
      )}
      {/* 비밀번호 및 확인 필드 */}
      <PasswordField
        password={formData.password}
        showPassword={false}
        isPasswordValid={(password) => password.length >= 8}
        handlePasswordChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        toggleShowPassword={() => {
          /* 토글 로직 */
        }}
      />
      <PasswordConfirmField
        passwordConfirm={formData.passwordConfirm}
        showPasswordConfirm={false}
        isPasswordMatch={formData.password === formData.passwordConfirm}
        handlePasswordConfirmChange={(e) =>
          setFormData({ ...formData, passwordConfirm: e.target.value })
        }
        toggleShowPasswordConfirm={() => {
          /* 토글 로직 */
        }}
      />
    </form>
  );
};

export default SignUpForm;
