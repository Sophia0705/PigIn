import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoItem from "./CryptoItem";
import CryptoCurrenciesData from "../../../data/CryptoCurrenciesData.json";
import { CryptoItemData } from "../../interfaces/CryptoInterface";

interface CryptoItemsContainerProps {
  title: string;
}

const CryptoItemsContainer: React.FC<CryptoItemsContainerProps> = ({
  title,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("시가총액");
  const [sortedData, setSortedData] = useState<CryptoItemData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 선택 옵션에 따른 정렬 로직
    const sortedCryptos = [...CryptoCurrenciesData].sort((a, b) => {
      switch (selectedOption) {
        case "시가총액":
          return b.marketCap - a.marketCap;
        case "거래량":
          return b.volume - a.volume;
        case "등락률":
          return (
            parseFloat(b.percentageChange.replace("%", "")) -
            parseFloat(a.percentageChange.replace("%", ""))
          );
        case "거래대금":
          return b.volume * b.price - a.volume * a.price; // 거래대금 = 거래량 * 현재가
        default:
          return 0;
      }
    });
    setSortedData(sortedCryptos);
  }, [selectedOption]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleItemClick = (item: CryptoItemData) => {
    navigate(`/investment/cryptocurrency/${item.symbol}`, {
      state: { item },
    });
  };

  return (
    <div className="flex-grow bg-white rounded-t-3xl mt-4 p-4 shadow-md w-full">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="relative flex justify-center -mt-2 mb-4 bg-green-100 rounded-full">
        {["시가총액", "거래량", "등락률", "거래대금"].map((option) => (
          <button
            key={option}
            onClick={() => handleOptionChange(option)}
            className={`px-4 py-2 rounded-full focus:outline-none transition-colors ${
              selectedOption === option
                ? "bg-customDarkGreen text-white font-extrabold"
                : "bg-transparent text-gray-700 font-extrabold"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="flex flex-row overflow-x-auto space-x-4 w-80 max-w-full mx-auto flex-nowrap">
        {sortedData.map((item: CryptoItemData) => (
          <div
            key={item.symbol}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer flex-shrink-0 w-64 h-70"
          >
            <CryptoItem
              name={item.name}
              price={item.price}
              percentageChange={item.percentageChange}
              weeklyPrices={item.weeklyPrices}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoItemsContainer;
