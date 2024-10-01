import React, { useEffect, useState } from 'react';
import { useMemberStore } from '../../store/memberStore'; // Zustand store 가져오기
import { getMemberInfoAPI } from '../../api/member/getMemberInfoAPI';
import { FiEdit } from 'react-icons/fi';
import UpdateProfileModal from './modals/UpdateProfileModal';

export const MemberInfo: React.FC = () => {
  const { openUpdateProfileModal, isUpdateProfileModalOpen, setFormData } =
    useMemberStore(); // 전역적으로 관리되는 상태에서 모달 열기 함수 가져오기

  const [memberInfo, setMemberInfo] = useState<
    {
      label: string;
      value: string | number;
    }[]
  >([
    { label: '이름', value: '홍길동' },
    { label: '생년월일', value: '950502' },
    { label: '이메일', value: 'example@example.com' },
    { label: '전화번호', value: '010-1234-5678' },
    { label: '저축률', value: 0 },
  ]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 회원 정보를 불러옴
    const fetchMemberInfo = async () => {
      try {
        const data = await getMemberInfoAPI(); // API 호출하여 회원 정보 가져오기
        // 가져온 데이터로 userInfo 상태 업데이트
        console.log('MemberInfo data: ', data);

        // 가져온 데이터를 zustand의 formData로 업데이트
        setFormData({
          name: data.name,
          birth: data.birth,
          email: data.email,
          phoneNumber: `${data.phoneNumber.slice(0, 3)}-${data.phoneNumber.slice(3, 7)}-${data.phoneNumber.slice(7)}`,
          savingRate: data.savingRate,
        });

        setMemberInfo([
          { label: '이름', value: data.name },
          { label: '생년월일', value: data.birth },
          { label: '이메일', value: data.email },
          {
            label: '전화번호',
            value: `${data.phoneNumber.slice(0, 3)}-${data.phoneNumber.slice(3, 7)}-${data.phoneNumber.slice(7)}`,
          },
          { label: '저축률', value: `${data.savingRate}%` },
        ]);
      } catch (error) {
        console.error('회원 정보 불러오기 실패:', error);
      }
    };

    fetchMemberInfo();
  }, [setFormData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[340px] text-center mb-0">
      {/* 제목과 버튼을 같은 줄에 배치 */}
      <div className="relative flex items-center mb-4">
        <h2 className="text-xl font-bold text-center flex-grow">회원 정보</h2>
        <button
          onClick={openUpdateProfileModal}
          className="absolute right-0 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center space-x-2"
        >
          <FiEdit className="text-s" />
          <span className="text-xs">수정</span>
        </button>
      </div>
      {/* 반복문을 사용하여 회원 정보 출력 */}
      {memberInfo.map((info) => (
        <div
          key={info.label} // 배열을 순회할 때 고유한 key 필요
          className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2"
        >
          <div className="flex flex-col text-left">
            <label className="text-sm">{info.label}:</label> {/* 항목 이름 */}
            <span className="text-sm">
              {info.value !== undefined ? info.value : '정보 없음'}
            </span>{' '}
            {/* 항목 값 */}
          </div>
        </div>
      ))}

      {/* UpdateProfileModal 조건부 렌더링 */}
      {isUpdateProfileModalOpen && <UpdateProfileModal />}
    </div>
  );
};
