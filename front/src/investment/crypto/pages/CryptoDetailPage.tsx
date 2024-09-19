// CryptoDetailPage.tsx

import React from "react";
import { useParams } from "react-router-dom";

const CryptoDetailPage: React.FC = () => {
  // Access the dynamic symbol parameter from the route
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white p-4">
      <h1 className="text-3xl font-bold mb-4">Cryptocurrency Detail Page</h1>
      {/* Display the cryptocurrency symbol */}
      <p className="text-lg">Cryptocurrency Symbol: {symbol}</p>

      {/* Placeholder for additional cryptocurrency details */}
      <div className="w-full max-w-md bg-gray-100 rounded-lg p-6 shadow-md">
        <p>Cryptocurrency Information for {symbol} will go here.</p>
      </div>
    </div>
  );
};

export default CryptoDetailPage;
