import React, { useState } from "react";
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
  const navigate = useNavigate();

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
        {CryptoCurrenciesData.map((item: CryptoItemData) => (
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
