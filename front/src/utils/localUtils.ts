// 액세스 토큰을 로컬 스토리지에서 가져오는 함수
export const getAccessToken = (): string | null => {
  const token = localStorage.getItem('access');
  const expiry = localStorage.getItem('accessExpiry');

  if (!token || !expiry) {
    return null; // 토큰이나 만료 시간이 없으면 null 반환
  }

  // 만료 시간이 현재 시간보다 이전이면 토큰 삭제 및 null 반환
  const now = Date.now();
  if (now > parseInt(expiry, 10)) {
    removeAccessToken(); // 만료된 토큰 삭제
    return null;
  }

  return token;
};

// 액세스 토큰을 로컬 스토리지에 저장하는 함수 (만료 시간 10분 고정)
export const setAccessToken = (token: string): void => {
  const expiryTime = Date.now() + 10 * 60 * 1000; // 10분(600초) 후 만료
  localStorage.setItem('access', token);
  localStorage.setItem('accessExpiry', expiryTime.toString()); // 만료 시간을 로컬 스토리지에 저장
};

// 액세스 토큰을 로컬 스토리지에서 제거하는 함수
export const removeAccessToken = (): void => {
  localStorage.removeItem('access');
  localStorage.removeItem('accessExpiry'); // 만료 시간도 같이 제거
};
