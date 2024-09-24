import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import InvestmentPage from './pages/InvestmentPage';
import StockMainPage from './investment/stock/pages/StockMainPage';
import CryptoMainPage from './investment/crypto/pages/CryptoMainPage';
import GoldDetailPage from './investment/gold/pages/GoldDetailPage';
import StockSearchPage from './investment/stock/pages/StockSearchPage';
import CryptoSearchPage from './investment/crypto/pages/CryptoSearchPage';
import StockDetailPage from './investment/stock/pages/StockDetailPage';
import CryptoDetailPage from './investment/crypto/pages/CryptoDetailPage';
import MyPortfolio from './portfolio/MyPortfolio';
import AutoInvestment from './portfolio/AutoInvestment';
import Quiz from './quiz/Quiz';
import LandingPage from './member/pages/LandingPage';
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
          <Route path="/main" element={<MainPage />} />
          {/* LandingPage를 기본 경로로 설정 */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/investment" element={<InvestmentLayout />}>
            <Route index element={<InvestmentPage />} />
            <Route path="stock" element={<StockDetailLayout />}>
              <Route index element={<StockMainPage />} />
              <Route path="search" element={<StockSearchPage />} />
              <Route path=":symbol" element={<StockDetailPage />} />
            </Route>
            <Route path="cryptocurrency" element={<CryptoDetailLayout />}>
              <Route index element={<CryptoMainPage />} />
              <Route path="search" element={<CryptoSearchPage />} />
              <Route path=":symbol" element={<CryptoDetailPage />} />
            </Route>
            <Route path="gold" element={<GoldDetailPage />} />
          </Route>
          <Route path="/myportfolio" element={<MyPortfolio />} />
          <Route path="/auto-invest" element={<AutoInvestment />} />
          <Route path="/quiz" element={<Quiz />} />
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
