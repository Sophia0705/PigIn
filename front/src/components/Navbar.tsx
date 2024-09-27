import React from 'react';
import {
  FaHome,
  FaChartPie,
  FaChartBar,
  FaHeart,
  FaUser,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 right-4 w-auto flex justify-center z-10">
      <div className="flex items-center justify-around w-full max-w-md h-[75px] bg-green-100 rounded-full shadow-md px-4">
        {/* 홈 */}
        <NavLink
          to="/main"
          className={({ isActive }) =>
            `p-2 ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaHome size={24} />
        </NavLink>

        {/* 포트폴리오 */}
        <NavLink
          to="/myportfolio"
          className={({ isActive }) =>
            `p-2 ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaChartPie size={24} />
        </NavLink>

        {/* 투자 */}
        <NavLink
          to="/investment"
          className={({ isActive }) =>
            `p-2 ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaChartBar size={24} />
        </NavLink>

        {/* 찜 */}
        <NavLink
          to="/favorite"
          className={({ isActive }) =>
            `p-2 ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaHeart size={24} />
        </NavLink>

        {/* 개인정보 */}
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `p-2 ${
              isActive
                ? 'text-customAqua hover:text-customAqua'
                : 'text-black hover:text-black'
            }`
          }
        >
          <FaUser size={24} />
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
