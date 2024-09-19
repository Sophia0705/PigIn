import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';

export const UserInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center mb-8">
      <h2 className="text-xl font-bold mb-4">회원 정보</h2>

      {/* 이름 */}
      <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
        <div className="flex flex-col text-left">
          <label className="text-sm">이름:</label>
          <span className="text-sm">홍길동</span>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
        <div className="flex flex-col text-left">
          <label className="text-sm">비밀번호:</label>
          <span className="text-sm">********</span>
        </div>
        <CiEdit
          className="text-gray-500 cursor-pointer text-3xl"
          onClick={() => navigate('/edit')}
        />
      </div>

      {/* 이메일 */}
      <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
        <div className="flex flex-col text-left">
          <label className="text-sm">이메일:</label>
          <span className="text-sm">example@example.com</span>
        </div>
        <CiEdit
          className="text-gray-500 cursor-pointer text-3xl"
          onClick={() => navigate('/edit')}
        />
      </div>

      {/* 전화번호 */}
      <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
        <div className="flex flex-col text-left">
          <label className="text-sm">전화번호:</label>
          <span className="text-sm">010-1234-5678</span>
        </div>
        <CiEdit
          className="text-gray-500 cursor-pointer text-3xl"
          onClick={() => navigate('/edit')}
        />
      </div>
    </div>
  );
};
