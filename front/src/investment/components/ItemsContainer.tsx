import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StockItem from "../stock/components/StockItem";
import CryptoItem from "../crypto/components/CryptoItem";
import KoreanStocksData from "../../data/KoreanStocksData.json";
import CryptoCurrenciesData from "../../data/CryptoCurrenciesData.json";

import { StockItemData } from "../interfaces/StockInterface";
import { CryptoItemData } from "../interfaces/CryptoInterface";

interface ItemContainerProps {
  title: string;
  type: "stock" | "crypto";
}

const ItemsContainer: React.FC<ItemContainerProps> = ({ title, type }) => {
  const [selectedOption, setSelectedOption] = useState<string>("시가총액");
  const navigate = useNavigate();

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const data =
    type === "stock"
      ? (KoreanStocksData as StockItemData[])
      : (CryptoCurrenciesData as CryptoItemData[]);

  const ItemComponent = type === "stock" ? StockItem : CryptoItem;

  const handleItemClick = (item: StockItemData | CryptoItemData) => {
    if (type === "stock") {
      navigate(`/investment/stock/${item.stck_shrn_iscd}`, {
        state: { item },
      });
    } else if (type === "crypto") {
      navigate(`/investment/cryptocurrency/${item.symbol}`, {
        state: { item },
      });
    }
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
        {data.map((item) => (
          <div
            key={type === "stock" ? item.stck_shrn_iscd : item.symbol}
            onClick={() => handleItemClick(item)}
            className="cursor-pointer flex-shrink-0 w-64 h-70"
          >
            <ItemComponent
              key={type === "stock" ? item.stck_shrn_iscd : item.symbol}
              name={type === "stock" ? item.hts_kor_isnm : item.name}
              price={type === "stock" ? item.stck_prpr : item.price}
              percentageChange={
                type === "stock" ? item.prdy_ctrt : item.percentageChange
              }
              weeklyPrices={item.weeklyPrices}
              data={item.weeklyPrices?.map((price, index) => ({
                name: `Day ${index + 1}`,
                value: price,
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsContainer;
