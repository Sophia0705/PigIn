import React, { useEffect, useState } from 'react';
import LoginModalManager from '../components/LoginModalManager'; // 모달 관리자
import { getAccessToken } from '../../utils/localUtils';
import { useMemberStore } from '../../store/memberStore';

interface AuthGuardProps {
  children: React.ReactNode; // 보호할 컴포넌트 (MyPage 등의 콘텐츠)
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { openLoginModal } = useMemberStore();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  useEffect(() => {
    const token = getAccessToken();
    // console.log('AuthGuard accessToken:', token);
    if (!token) {
      openLoginModal(); // 토큰이 없으면 로그인 모달을 띄움
    } else {
      setIsTokenValid(true); // 토큰이 있으면 페이지 콘텐츠를 보여줌
    }
  }, [openLoginModal]);

  // 로그인되지 않은 경우 모달만 표시
  if (!isTokenValid) {
    return <LoginModalManager />;
  }

  // 토큰이 유효한 경우 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

export default AuthGuard;
