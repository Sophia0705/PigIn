import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

interface DetailHeaderProps {
  title: string;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/investment");
  };

  const handleSearch = () => {
    switch (title) {
      case "주식":
        navigate("/investment/stock/search");
        break;
      case "가상화폐":
        navigate("/investment/cryptocurrency/search");
        break;
    }
  };

  return (
    <div className="flex justify-between items-center w-screen p-4 bg-customDarkGreen">
      {/* 뒤로가기 */}
      <p onClick={handleBack} className="text-white bg-inherit">
        <FaArrowLeft size={20} />
      </p>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-white absolute left-1/2 transform -translate-x-1/2">
        {title}
      </h1>

      {/* 검색 */}
      {title !== "금" && (
        <p onClick={handleSearch} className="text-white">
          <FaSearch size={20} />
        </p>
      )}
    </div>
  );
};

export default DetailHeader;
