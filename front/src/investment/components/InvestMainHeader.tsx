import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthGuardClickable from '../../member/components/AuthGuardClickable';

const InvestMainHeader: React.FC = () => {
  const nav = useNavigate();
  const handleAuthSuccess = (path: string) => {
    nav(path);
  };
  return (
    <div className="flex justify-between items-center w-full p-4 bg-customDarkGreen text-white rounded-b-lg">
      <h1 className="text-4xl font-bold mr-auto">투자</h1>
      <AuthGuardClickable
        onAuthSuccess={() => handleAuthSuccess('/auto-invest')}
      >
        <NavLink to="/auto-invest" className="inline-block">
          <button className="bg-green-100 text-green-900 font-semibold px-4 py-3 rounded-full shadow-md flex items-center">
            나의 자동투자
            <span className="bg-customDarkGreen text-white rounded-full px-3 py-1 ml-2">
              GO
            </span>
          </button>
        </NavLink>
      </AuthGuardClickable>
    </div>
  );
};

export default InvestMainHeader;
