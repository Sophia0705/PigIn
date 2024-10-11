import { MemberInfo } from '../components/MemberInfo';
import AccountSlider from '../components/AccountSlider';
import { useEffect, useState } from 'react';
import { useMemberStore } from '../../store/memberStore';
import { FiLogOut } from 'react-icons/fi';
import { logoutAPI } from '../../api/member/logoutAPI';
import FailModal from '../components/modals/FailModal';
import SuccessModal from '../components/modals/SuccessModal';

const MyPage: React.FC = () => {
  const { checkLoginStatus, isLoggedIn } = useMemberStore();

  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태
  const [showFailModal, setShowFailModal] = useState(false); // 실패 모달 상태
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지
  const [failMessage, setFailMessage] = useState(''); // 실패 메시지

  useEffect(() => {
    checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인
  }, [checkLoginStatus]);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      const success = await logoutAPI();
      if (success) {
        setSuccessMessage('로그아웃 성공하였습니다!');
        setShowSuccessModal(true); // 성공 모달 띄우기
      } else {
        setFailMessage('로그아웃 실패하였습니다.');
        setShowFailModal(true); // 실패 모달 띄우기
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
      setFailMessage('로그아웃 실패하였습니다.');
      setShowFailModal(true); // 실패 모달 띄우기
    }
  };

  // 성공 모달에서 확인 버튼을 누르면 페이지 새로고침
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center ">
      {/* MyPage 타이틀 및 회원 탈퇴 버튼 */}
      <div className="relative w-full px-0 flex items-center justify-end p-4 bg-customDarkGreen">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white">
          마이 페이지
        </h1>
        {/* 로그아웃 버튼: 로그인 상태일 때만 렌더링 */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded mt-2 mr-4"
          >
            <FiLogOut className="text-md" />
            <span className="text-sm">로그아웃</span>
          </button>
        )}
      </div>
      {/* 회원 정보 컴포넌트 */}
      <div className="mt-4 w-full flex justify-center relative">
        <MemberInfo />
      </div>

      {/* 계좌 정보 슬라이더 컴포넌트 */}
      <div className="mt-5 w-full flex justify-center">
        <AccountSlider />
      </div>
      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          setShowModal={handleSuccessModalClose} // 확인 버튼 클릭 시 handleSuccessModalClose 호출
          title={successMessage}
          buttonText="확인"
          buttonColor="bg-customAqua"
          buttonHoverColor="hover:bg-[#7ee9ce]"
        />
      )}

      {/* 실패 모달 */}
      {showFailModal && (
        <FailModal
          setShowModal={setShowFailModal} // 실패 모달 닫기
          title={failMessage}
          buttonText="확인"
          buttonColor="bg-customRed"
          buttonHoverColor="hover:bg-[#FF2414]"
        />
      )}
    </div>
  );
};

export default MyPage;
