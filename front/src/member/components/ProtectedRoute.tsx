// ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useStore } from '../../store/memberStore';
import LoginModalManager from '../components/LoginModalManager';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, openLoginModal } = useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우에만 로그인 모달을 열기
      openLoginModal();
    }
  }, [isLoggedIn, openLoginModal]); // isLoggedIn이 변경될 때만 실행

  if (!isLoggedIn) {
    // 로그인되지 않았을 때는 모달을 띄우고 페이지 렌더링 방지
    return <LoginModalManager />;
  }

  return children; // 로그인된 경우에는 보호된 페이지를 렌더링
};

export default ProtectedRoute;
