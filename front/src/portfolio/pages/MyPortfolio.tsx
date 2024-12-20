import { useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import PortfolioDetails from '../components/PortfolioDetails';
import { usePortfolioStore } from '../../store/portfolioStore';

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
    <div className="bg-gray-100 h-screen flex flex-col">
      <div
        className="bg-customDarkGreen flex-none  w-full"
        style={{ height: 'calc(44vh - 20px)' }}
      >
        <div className="max-w-5xl mx-auto h-full w-full py-6 px-6">
          <Dashboard />
        </div>
      </div>
      <div className="flex-grow w-full overflow-hidden">
        <PortfolioDetails />
      </div>
    </div>
  );
};

export default MyPortfolio;
