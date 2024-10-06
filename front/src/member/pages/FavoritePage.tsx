import React from 'react';
import StockList from '../components/StockList'; // 주식 목록 컴포넌트
import CryptoList from '../components/CryptoList'; // 가상화폐 목록 컴포넌트
// import { reissueAccessTokenAPI } from '../../api/member/reissueAccessTokenAPI';
// import {
//   setAccessToken,
//   getAccessToken,
//   removeAccessToken,
// } from '../../utils/localUtils';

const FavoritePage: React.FC = () => {
  // 토큰 재발급 버튼 클릭 핸들러
  // const handleTokenReissue = async () => {
  //   try {
  //     const currentToken = getAccessToken();
  //     console.log('현재 액세스 토큰:', currentToken);

  //     const newToken = await reissueAccessTokenAPI(); // 재발급 API 호출
  //     setAccessToken(newToken); // 새로 받은 토큰 저장
  //     console.log('새로운 액세스 토큰:', newToken);
  //   } catch (error) {
  //     console.error('토큰 재발급 실패:', error);
  //     removeAccessToken(); // 실패 시 기존 토큰 삭제
  //   }
  // };

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex justify-between items-center w-screen pt-10 bg-customDarkGreen">
        <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2 pb-2">
          찜 목록
        </h1>
      </div>
      {/* 주식 목록을 5개만 렌더링*/}
      <div className="mt-6">
        <StockList limit={5} showTitle={true} />
      </div>
      {/* 가상화폐 목록을 5개만 렌더링*/}
      <div className="mt-7">
        <CryptoList limit={5} showTitle={true} />
      </div>
      {/* 토큰 재발급 테스트 버튼 */}
      {/* <div className="mt-10">
        <button
          onClick={handleTokenReissue}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          토큰 재발급 테스트
        </button>
      </div> */}
    </div>
  );
};

export default FavoritePage;
