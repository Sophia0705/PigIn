import React from "react";
import { NavLink } from 'react-router-dom';

const InvestMainHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-screen p-4 bg-customDarkGreen text-white rounded-b-lg">
      <h1 className="text-4xl font-bold mr-auto">투자</h1>
      <NavLink to="/auto-invest" className="inline-block">
        <button className="bg-green-100 text-green-900 font-semibold px-4 py-3 rounded-full shadow-md flex items-center">
          나의 자동투자
          <span className="bg-customDarkGreen text-white rounded-full px-3 py-1 ml-2">
            GO
          </span>
        </button>
      </NavLink>
    </div>
  );
};

export default InvestMainHeader;
