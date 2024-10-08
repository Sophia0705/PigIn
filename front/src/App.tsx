import React, { useEffect } from 'react';
import { registerServiceWorker, getDeviceToken } from './utils/notification';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import './App.css';
import './fonts.css';
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
import FlowQuiz from './quiz/FlowQuiz';
import LandingPage from './member/pages/LandingPage';
import MyPage from './member/pages/MyPage';
import FavoritePage from './member/pages/FavoritePage';
import StockFavoritesPage from './member/pages/StockFavoritesPage';
import CryptoFavoritesPage from './member/pages/CryptoFavoritesPage';
import TestPage from './member/pages/TestPage';
import QRPaymentPage from './member/pages/QRPaymentPage';

const App: React.FC = () => {
  useEffect(() => {
    const setupPushNotifications = async () => {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await registerServiceWorker();
        const token = await getDeviceToken();
        console.log('FCM Token:', token);
      } else {
        console.log('Notification permission denied');
      }
    };

    setupPushNotifications();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* LandingPage는 Navbar 없이 렌더링 */}
          <Route path="/" element={<LandingPage />} />

          {/* 나머지 모든 라우트는 Navbar와 함께 렌더링 */}
          <Route element={<NavbarWrapper />}>
            <Route path="/main" element={<MainPage />} />
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
            <Route path="/flow-quiz" element={<FlowQuiz />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/favorite" element={<FavoritePage />} />
            <Route path="/stock-favorites" element={<StockFavoritesPage />} />
            <Route path="/crypto-favorites" element={<CryptoFavoritesPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="qr-payment" element={<QRPaymentPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

const NavbarWrapper: React.FC = () => {
  return (
    <>
      <Outlet />
      <Navbar />
    </>
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
