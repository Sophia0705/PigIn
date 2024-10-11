// 액세스 토큰을 로컬 스토리지에서 가져오는 함수
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access');
};

// 액세스 토큰을 로컬 스토리지에 저장하는 함수 (만료 시간 10분 고정)
export const setAccessToken = (token: string): void => {
  localStorage.setItem('access', token);
};

// 액세스 토큰을 로컬 스토리지에서 제거하는 함수
export const removeAccessToken = (): void => {
  localStorage.removeItem('access');
};
