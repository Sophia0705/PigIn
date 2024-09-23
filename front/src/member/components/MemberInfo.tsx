import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';

// MemberInfo 컴포넌트에서 openUpdateProfileModal props를 받음
interface MemberInfoProps {
  openUpdateProfileModal: () => void;
}

export const MemberInfo: React.FC<MemberInfoProps> = ({
  openUpdateProfileModal,
}) => {
  const navigate = useNavigate();

  // 회원 정보 데이터를 배열로 정의
  const userInfo = [
    { label: '이름', value: '홍길동', editable: false },
    { label: '생년월일', value: '950502', editable: false },
    { label: '비밀번호', value: '********', editable: true },
    { label: '이메일', value: 'example@example.com', editable: true },
    { label: '전화번호', value: '010-1234-5678', editable: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[340px] text-center mb-0">
      <h2 className="text-xl font-bold mb-4">회원 정보</h2>

      {/* 반복문을 사용하여 회원 정보 출력 */}
      {userInfo.map((info, index) => (
        <div
          key={index}
          className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2"
        >
          <div className="flex flex-col text-left">
            <label className="text-sm">{info.label}:</label>
            <span className="text-sm">{info.value}</span>
          </div>
          {/* 비밀번호, 이메일, 전화번호는 수정 가능 */}
          {info.editable && (
            <CiEdit
              className="text-gray-500 cursor-pointer text-4xl"
              onClick={() => navigate('/update-profile')}
            />
          )}
        </div>
      ))}
    </div>
  );
};
