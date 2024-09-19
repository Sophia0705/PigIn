import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './user/pages/LandingPage'; // LandingPage 추가
import InvestmentPage from './pages/InvestmentPage';
import StockDetailPage from './investment/stock/pages/StockMainPage';
import CryptoDetailPage from './investment/crypto/pages/CryptoMainPage';
import GoldDetailPage from './investment/gold/pages/GoldDetailPage';
import StockSearchPage from './investment/stock/pages/StockSearchPage';
import CryptoSearchPage from './investment/crypto/pages/CryptoSearchPage';
import MyPage from './user/pages/MyPage'; // MyPage 추가
import SignUpModal from './user/pages/SignUpModal';
import IsLoginModal from './user/modal/IsLoginModal';
import LoginPage from './user/pages/LoginPage';

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 로그인 모달 열기
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  // 로그인 모달 닫기
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col justify-between items-center bg-customDarkGreen">
        {/* 로그인 모달 추가 */}
        <IsLoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        <Routes>
          <Route path="/" element={<LandingPage />} />{' '}
          {/* LandingPage를 기본 경로로 설정 */}
          <Route path="/investment" element={<InvestmentLayout />}>
            <Route index element={<InvestmentPage />} />
            <Route path="stock" element={<StockDetailLayout />}>
              <Route index element={<StockDetailPage />} />
              <Route path="search" element={<StockSearchPage />} />
            </Route>
            <Route path="cryptocurrency" element={<CryptoDetailLayout />}>
              <Route index element={<CryptoDetailPage />} />
              <Route path="search" element={<CryptoSearchPage />} />
            </Route>
            <Route path="gold" element={<GoldDetailPage />} />
          </Route>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<SignUpModal />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Navbar />
        {/* 로그인 모달 열기 버튼 추가 */}
        <button
          onClick={openLoginModal}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          로그인 모달 열기
        </button>
      </div>
    </Router>
  );
};

const InvestmentLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const StockDetailLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const CryptoDetailLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
