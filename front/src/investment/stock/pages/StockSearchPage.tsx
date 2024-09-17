import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const StockSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate();

  // 입력값 변환시키는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 이전 페이지로 이동하는 함수
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-start p-4 w-screen">
      <div className="flex items-center justify-start w-full p-0 mb-4 space-x-2">
        {/* 뒤로가기 버튼 */}
        <div onClick={handleBack} className="self-start mt-2 text-white">
          <FaArrowLeft size={24} />
        </div>

        {/* 검색 바 */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="주식 이름을 입력하세요..."
          className="flex-grow w-full p-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-customDarkGreen"
        />
      </div>

      {/* 검색 결과 */}
      <p className="mt-4 text-lg text-white">
        검색어: {searchQuery ? searchQuery : "없음"}
      </p>
    </div>
  );
};

export default StockSearchPage;
