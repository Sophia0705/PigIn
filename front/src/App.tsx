import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import './App.css';
import Layout from './mobileLayout';
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
import MyPortfolio from './portfolio/pages/MyPortfolio';
import AutoInvestment from './portfolio/pages/AutoInvestment';
import Quiz from './quiz/Quiz';
import LandingPage from './member/pages/LandingPage';
import MyPage from './member/pages/MyPage';
import FavoritePage from './member/pages/FavoritePage';
import StockFavoritesPage from './member/pages/StockFavoritesPage';
import CryptoFavoritesPage from './member/pages/CryptoFavoritesPage';
import TestPage from './member/pages/TestPage';
// import ProtectedRoute from './member/components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
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
          {/* 로그인된 사용자만 접근 가능한 경로 */}
          <Route path="/favorite" element={<FavoritePage />} />
          <Route path="/stock-favorites" element={<StockFavoritesPage />} />
          <Route path="/crypto-favorites" element={<CryptoFavoritesPage />} />
          <Route path="test" element={<TestPage />} />
        </Routes>
        <Navbar />
      </Layout>
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
