import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 가져오기
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { FaPiggyBank, FaPlusCircle } from 'react-icons/fa';
import { useSpendingAccountStore } from '../../store/SpendingAccountStore';
import SpendingAccountRegisterModal from './modals/SpendingAccountRegisterModal';
import {
  fetchInvestmentAccountInfo,
  fetchSpendingAccountInfo,
} from '../../api/member/accountAPI';

// 계좌 번호에 하이픈 추가하는 함수
const formatAccountNumber = (accountNo: string) => {
  return accountNo.replace(/(\d{4})(?=\d)/g, '$1-');
};

const AccountSlider: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const {
    isSpendingAccountRegisterModalOpen,
    openSpendingAccountRegisterModal,
  } = useSpendingAccountStore();

  const [investmentAccount, setInvestmentAccount] = useState<{
    accountNo: string;
    balance: number;
  } | null>(null);

  const [spendingAccount, setSpendingAccount] = useState<{
    accountNo: string;
    balance: number;
    bank: string;
  } | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const fetchedInvestmentAccount = await fetchInvestmentAccountInfo();
        console.log(
          'AccountSlider 투자 계좌 정보 response:',
          fetchedInvestmentAccount
        );
        setInvestmentAccount(fetchedInvestmentAccount);

        const fetchedSpendingAccount = await fetchSpendingAccountInfo();
        console.log(
          'AccountSlider 소비 계좌 정보 response:',
          fetchedSpendingAccount
        );
        setSpendingAccount(fetchedSpendingAccount);
      } catch (error) {
        console.error('Failed to load account information:', error);
      }
    };

    loadAccounts();
  }, []);

  const handleSpendingAccountClick = () => {
    if (spendingAccount) {
      navigate('/qr-payment'); // 소비 계좌가 있을 때 qr-payment 페이지로 이동
    } else {
      openSpendingAccountRegisterModal(); // 소비 계좌가 없을 때 계좌 등록 모달 열기
    }
  };

  return (
    <div className="w-[400px] h-[350px] mx-auto mt-0 relative">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        계좌 정보
      </h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        modules={[Pagination, Navigation]}
        className="relative rounded-lg shadow-lg"
        style={{ paddingLeft: '30px', paddingRight: '30px' }}
      >
        {/* 첫 번째 슬라이드 (투자 계좌) */}
        <SwiperSlide>
          <div className="p-8 bg-green-100 rounded-lg shadow-md w-[340px] h-[28vh] flex flex-col items-center justify-center">
            <FaPiggyBank className="text-green-600 text-5xl mb-4" />
            <h2 className="text-xl font-bold mb-1 text-green-800">투자 계좌</h2>
            <p className="text-gray-700 text-base">싸피 뱅크</p>
            <p className="text-gray-700 text-base mb-2">
              계좌번호:{' '}
              {investmentAccount
                ? formatAccountNumber(investmentAccount.accountNo)
                : '로딩 중...'}
            </p>
            <p className="text-gray-700 text-lg font-semibold">
              잔액:{' '}
              {investmentAccount
                ? `${investmentAccount.balance.toLocaleString()}원`
                : '로딩 중...'}
            </p>
          </div>
        </SwiperSlide>

        {/* 두 번째 슬라이드 (소비 계좌) */}
        <SwiperSlide onClick={handleSpendingAccountClick}>
          {spendingAccount ? (
            <div className="p-8 bg-blue-100 rounded-lg shadow-md w-[340px] h-[28vh] flex flex-col items-center justify-center">
              <FaPiggyBank className="text-blue-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold mb-1 text-blue-800">
                소비 계좌
              </h2>
              <p className="text-gray-700 text-base">{spendingAccount.bank}</p>
              <p className="text-gray-700 text-base mb-2">
                계좌번호: {formatAccountNumber(spendingAccount.accountNo)}
              </p>
              <p className="text-gray-700 text-lg font-semibold">
                잔액: {`${spendingAccount.balance.toLocaleString()}원`}
              </p>
            </div>
          ) : (
            <div
              className="p-8 bg-red-100 rounded-lg shadow-md w-[340px] h-[28vh] flex flex-col items-center justify-center"
              onClick={openSpendingAccountRegisterModal}
            >
              <FaPlusCircle className="text-red-600 text-5xl mb-4" />
              <h2 className="text-xl font-bold text-red-800">소비 계좌 등록</h2>
            </div>
          )}
        </SwiperSlide>
      </Swiper>
      {isSpendingAccountRegisterModalOpen && <SpendingAccountRegisterModal />}
    </div>
  );
};

export default AccountSlider;
