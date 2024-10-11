import React from 'react';
import {
  FaHome,
  FaChartPie,
  FaChartBar,
  FaHeart,
  FaUser,
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthGuardClickable from '../member/components/AuthGuardClickable';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (path: string) => {
    navigate(path);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 w-auto flex justify-center z-10">
      <div className="flex items-center justify-around w-full max-w-md h-[75px] bg-green-100 rounded-full shadow-md px-4">
        {/* 홈 */}
        <NavLink
          to="/main"
          className={({ isActive }) =>
            `p-2 flex items-center justify-center ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaHome size={24} />
        </NavLink>

        {/* 포트폴리오 */}
        <AuthGuardClickable
          onAuthSuccess={() => handleAuthSuccess('/myportfolio')}
        >
          <NavLink
            to="/myportfolio"
            className={({ isActive }) =>
              `p-2 flex items-center justify-center ${
                isActive
                  ? 'text-customAqua hover:text-customAqua'
                  : 'text-black hover:text-black'
              }`
            }
          >
            <FaChartPie size={24} />
          </NavLink>
        </AuthGuardClickable>

        {/* 투자 */}
        <NavLink
          to="/investment"
          className={({ isActive }) =>
            `p-2 flex items-center justify-center ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaChartBar size={24} />
        </NavLink>

        {/* 찜 */}
        <AuthGuardClickable
          onAuthSuccess={() => handleAuthSuccess('/favorite')}
        >
          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              `p-2 flex items-center justify-center ${
                isActive
                  ? 'text-customAqua hover:text-customAqua'
                  : 'text-black hover:text-black'
              }`
            }
          >
            <FaHeart size={24} />
          </NavLink>
        </AuthGuardClickable>

        {/* 마이페이지 */}
        <AuthGuardClickable onAuthSuccess={() => handleAuthSuccess('/mypage')}>
          <NavLink
            to="/mypage"
            className={({ isActive }) =>
              `p-2 flex items-center justify-center ${
                isActive
                  ? 'text-customAqua hover:text-customAqua'
                  : 'text-black hover:text-black'
              }`
            }
          >
            <FaUser size={24} />
          </NavLink>
        </AuthGuardClickable>
      </div>
    </div>
  );
};

export default Navbar;
