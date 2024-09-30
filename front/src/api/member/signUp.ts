import axiosInstance from '../axiosInstance';

export const checkEmailDuplication = async (email: string) => {
  const response = await axiosInstance.post('member/email-check', { email });
  return response.data;
};

export const requestVerificationCode = async (
  name: string,
  phoneNumber: string
) => {
  const response = await axiosInstance.post('member/mms-number-generate', {
    name,
    phoneNumber,
  });
  return response.data;
};

export const verifyAuthenticationCode = async (
  phoneNumber: string,
  authenticationNumber: string
) => {
  const response = await axiosInstance.post('member/mms-number-compare', {
    phoneNumber,
    authenticationNumber,
  });
  return response.data;
};

export const signUp = async (userData: {
  phoneNumber: string;
  name: string;
  email: string;
  birth: string;
  password: string;
}) => {
  const response = await axiosInstance.post('member/sign-up', userData);
  return response.data;
};
