import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./member/pages/LandingPage"; // LandingPage 추가
import InvestmentPage from "./pages/InvestmentPage";
import StockDetailPage from "./investment/stock/pages/StockMainPage";
import CryptoDetailPage from "./investment/crypto/pages/CryptoMainPage";
import GoldDetailPage from "./investment/gold/pages/GoldDetailPage";
import StockSearchPage from "./investment/stock/pages/StockSearchPage";
import CryptoSearchPage from "./investment/crypto/pages/CryptoSearchPage";
import MyPage from "./member/pages/MyPage"; // MyPage 추가

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col justify-between items-center bg-customDarkGreen">
        <Routes>
          <Route path="/" element={<LandingPage />} />{" "}
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
          {/* 마이페이지 경로 추가 */}
          <Route path="/mypage" element={<MyPage />} />
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
