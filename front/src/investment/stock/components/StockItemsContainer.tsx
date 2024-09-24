import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StockItem from "./StockItem";
import KoreanStocksData from "../../../data/KoreanStocksData.json";
import { StockItemData } from "../../interfaces/StockInterface";

interface StockItemsContainerProps {
  title: string;
}

const StockItemsContainer: React.FC<StockItemsContainerProps> = ({ title }) => {
  const [selectedOption, setSelectedOption] = useState<string>("시가총액");
  const [sortedData, setSortedData] = useState<StockItemData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sortedStocks = [...KoreanStocksData].sort((a, b) => {
      switch (selectedOption) {
        case "시가총액":
          return parseInt(b.marketCap) - parseInt(a.marketCap); // Assuming marketCap is a string representation of a number
        case "거래량":
          return parseInt(b.acml_vol) - parseInt(a.acml_vol); // Volume in acml_vol
        case "등락률":
          return parseFloat(b.prdy_ctrt) - parseFloat(a.prdy_ctrt); // Percentage change
        case "거래대금":
          return (
            parseInt(b.acml_vol) * b.stck_prpr -
            parseInt(a.acml_vol) * a.stck_prpr
          ); // 거래대금 = 거래량 * 현재가
        default:
          return 0;
      }
    });
    setSortedData(sortedStocks);
  }, [selectedOption]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleItemClick = (item: StockItemData) => {
    navigate(`/investment/stock/${item.stck_shrn_iscd}`, {
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
        {sortedData.map((item: StockItemData) => (
          <div
            key={item.stck_shrn_iscd}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer flex-shrink-0 w-64 h-70"
          >
            <StockItem
              name={item.hts_kor_isnm}
              price={item.stck_prpr}
              percentageChange={item.prdy_ctrt}
              weeklyPrices={item.weeklyPrices}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockItemsContainer;
