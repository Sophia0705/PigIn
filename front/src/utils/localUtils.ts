// src/utils/localUtils.ts

// 액세스 토큰을 로컬 스토리지에서 가져오는 함수
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// 액세스 토큰을 로컬 스토리지에 저장하는 함수
export const setAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

// 액세스 토큰을 로컬 스토리지에서 제거하는 함수
export const removeAccessToken = (): void => {
  localStorage.removeItem('accessToken');
};
