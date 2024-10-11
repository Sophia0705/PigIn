import React, { useState } from 'react';
import { getAccessToken } from '../../utils/localUtils';
import { useMemberStore } from '../../store/memberStore';
import LoginModalManager from '../components/LoginModalManager';

interface AuthGuardClickableProps {
  children: React.ReactNode; // 보호할 컴포넌트
  onAuthSuccess: () => void; // 로그인 성공 후 실행될 콜백 함수
}

const AuthGuardClickable: React.FC<AuthGuardClickableProps> = ({
  children,
  onAuthSuccess,
}) => {
  const { openIsLoginModal } = useMemberStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 클릭 이벤트를 막음
    const token = getAccessToken();

    if (!token) {
      // 로그인되지 않은 경우 로그인 모달을 띄움
      setShowLoginModal(true);
      openIsLoginModal();
    } else {
      // 로그인된 경우에만 콜백 함수 실행
      onAuthSuccess();
    }
  };

  // 자식 컴포넌트의 onClick 이벤트를 직접 감싸서 제어
  const childWithProps = React.cloneElement(children as React.ReactElement, {
    onClick: handleClick, // 자식 컴포넌트의 클릭 이벤트를 오버라이드
  });

  return (
    <>
      {childWithProps} {/* 항상 자식 컴포넌트를 보여줌 */}
      {showLoginModal && <LoginModalManager />}{' '}
      {/* 로그인되지 않은 경우 모달 표시 */}
    </>
  );
};

export default AuthGuardClickable;
