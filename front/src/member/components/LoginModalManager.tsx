// ModalManager.tsx
import React from 'react';
import IsLoginModal from './modals/IsLoginModal';
import LoginModal from './modals/LoginModal';
import SignUpModal from './modals/SignUpModal';
import FindEmailModal from './modals/FindEmailModal';
// import FindPasswordModal from './modals/FindPasswordModal';
import { useStore } from '../../store/memberStore';

const LoginModalManager: React.FC = () => {
  const {
    isIsLoginModalOpen,
    isLoginModalOpen,
    isSignUpModalOpen,
    isFindEmailModalOpen,
    // isFindPasswordModalOpen,
  } = useStore();

  return (
    <>
      {isIsLoginModalOpen && <IsLoginModal />}
      {isLoginModalOpen && <LoginModal />}
      {isSignUpModalOpen && <SignUpModal />}
      {isFindEmailModalOpen && <FindEmailModal />}
      {/* {isFindPasswordModalOpen && <FindPasswordModal />} */}
    </>
  );
};

export default LoginModalManager;
