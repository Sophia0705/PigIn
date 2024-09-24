import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import InvestmentPage from "./pages/InvestmentPage";
import StockDetailPage from "./investment/stock/pages/StockMainPage";
import CryptoDetailPage from "./investment/crypto/pages/CryptoMainPage";
import GoldDetailPage from "./investment/gold/pages/GoldDetailPage";
import StockSearchPage from "./investment/stock/pages/StockSearchPage";
import CryptoSearchPage from "./investment/crypto/pages/CryptoSearchPage";
import StockMainPage from "./investment/stock/pages/StockMainPage";
import CryptoMainPage from "./investment/crypto/pages/CryptoMainPage";
import MyPortfolio from "./portfolio/MyPortfolio";
import AutoInvestment from "./portfolio/AutoInvestment";
import Quiz from "./quiz/Quiz";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col justify-between items-center bg-customDarkGreen">
        <Routes>
          <Route path="/" element={<MainPage />} />
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
