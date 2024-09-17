import { useEffect } from "react";
import Dashboard from "./components/Dashboard";
import PortfolioDetails from "./components/PortfolioDetails";
// import Navbar from "../components/Navbar";
import { usePortfolioStore } from "../store/portfolioStore";

const MyPortfolio: React.FC = () => {
  const { fetchPortfolioData, isLoading, error } = usePortfolioStore();

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading portfolio data...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Dashboard />
        <PortfolioDetails />
      </div>
      {/* <Navbar /> */}
    </div>
  );
};

export default MyPortfolio;
