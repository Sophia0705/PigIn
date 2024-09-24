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
import LandingPage from './member/pages/LandingPage';
import InvestmentPage from './pages/InvestmentPage';
import StockDetailPage from './investment/stock/pages/StockMainPage';
import CryptoDetailPage from './investment/crypto/pages/CryptoMainPage';
import GoldDetailPage from './investment/gold/pages/GoldDetailPage';
import StockSearchPage from './investment/stock/pages/StockSearchPage';
import CryptoSearchPage from './investment/crypto/pages/CryptoSearchPage';
import MyPage from './member/pages/MyPage';
import SignUpModal from './member/pages/SignUpModal';
import LoginPage from './member/pages/LoginPage';
import FavoritePage from './member/pages/FavoritePage';
import StockFavoritesPage from './member/pages/StockFavoritesPage';
import CryptoFavoritesPage from './member/pages/CryptoFavoritesPage';
import SpendingAccountRegister from './member/pages/SpendingAccountRegister';

const App: React.FC = () => {
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
          <Route path="/favorite" element={<FavoritePage />} />
          <Route path="/stock-favorites" element={<StockFavoritesPage />} />
          <Route path="/crypto-favorites" element={<CryptoFavoritesPage />} />
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
