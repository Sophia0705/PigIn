import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  // Navigate,
} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './member/pages/LandingPage'; // LandingPage 추가
import InvestmentPage from './pages/InvestmentPage';
import StockDetailPage from './investment/stock/pages/StockMainPage';
import CryptoDetailPage from './investment/crypto/pages/CryptoMainPage';
import GoldDetailPage from './investment/gold/pages/GoldDetailPage';
import StockSearchPage from './investment/stock/pages/StockSearchPage';
import CryptoSearchPage from './investment/crypto/pages/CryptoSearchPage';
import MyPage from './member/pages/MyPage'; // MyPage 추가
import SignUpModal from './member/pages/SignUpModal';
// import IsLoginModal from './member/modal/IsLoginModal';
import LoginPage from './member/pages/LoginPage';
import FavoritePage from './member/pages/FavoritePage';
import StockFavoritesPage from './member/pages/StockFavoritesPage'; // 주식 찜 목록 페이지
import CryptoFavoritesPage from './member/pages/CryptoFavoritesPage';
import InvestmentAccountCreation from './member/pages/InvestmentAccountCreation';
import SpendingAccountRegister from './member/pages/SpendingAccountRegister';
import WithdrawalModal from './member/modal/WithdrawalModal';
import UpdateProfileModal from './member/modal/UpdateProfileModal';

const App: React.FC = () => {
  // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // // 로그인 모달 열기
  // const openLoginModal = () => {
  //   setIsLoginModalOpen(true);
  // };

  // // 로그인 모달 닫기
  // const closeLoginModal = () => {
  //   setIsLoginModalOpen(false);
  // };

  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col justify-between items-center bg-customDarkGreen">
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
          <Route path="/update-profile" element={<UpdateProfileModal />} />
          <Route path="/withdrawal" element={<WithdrawalModal />} />
          <Route path="/favorite" element={<FavoritePage />} />
          <Route path="/stock-favorites" element={<StockFavoritesPage />} />
          <Route path="/crypto-favorites" element={<CryptoFavoritesPage />} />
          <Route
            path="/investment-account-creation"
            element={<InvestmentAccountCreation />}
          />
          <Route
            path="/spending-account-register"
            element={<SpendingAccountRegister />}
          />
        </Routes>
        <Navbar />
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
