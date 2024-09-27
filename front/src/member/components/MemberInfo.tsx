import React from 'react';
import { CiEdit } from 'react-icons/ci';
import { useStore } from '../../store/memberStore'; // Zustand store 가져오기

export const MemberInfo: React.FC = () => {
  const { openUpdateProfileModal } = useStore(); // 전역적으로 관리되는 상태에서 모달 열기 함수 가져오기

  // 회원 정보 데이터를 배열로 정의 (이름, 생년월일, 비밀번호 등)
  const userInfo = [
    { label: '이름', value: '홍길동', editable: false },
    { label: '생년월일', value: '950502', editable: false },
    { label: '비밀번호', value: '********', editable: true }, // 비밀번호만 수정 가능
    { label: '이메일', value: 'example@example.com', editable: false },
    { label: '전화번호', value: '010-1234-5678', editable: false },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[340px] text-center mb-0">
      <h2 className="text-xl font-bold mb-4">회원 정보</h2>

      {/* 반복문을 사용하여 회원 정보 출력 */}
      {userInfo.map((info, index) => (
        <div
          key={index} // 배열을 순회할 때 고유한 key 필요
          className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2"
        >
          <div className="flex flex-col text-left">
            <label className="text-sm">{info.label}:</label> {/* 항목 이름 */}
            <span className="text-sm">{info.value}</span> {/* 항목 값 */}
          </div>
          {/* 비밀번호만 수정 가능 */}
          {info.editable && (
            <CiEdit
              className="text-gray-500 cursor-pointer text-4xl"
              onClick={openUpdateProfileModal} // 수정 아이콘 클릭 시 회원정보수정 모달을 열기
            />
          )}
        </div>
      ))}
    </div>
  );
};
