import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { FaArrowLeft, FaRegHeart, FaHeart } from "react-icons/fa";
import { StockItemData } from "../../interfaces/StockInterface";

const StockDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stockData = location.state?.item as StockItemData;
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("7일");
  const [selectedInfoType, setSelectedInfoType] = useState<string>("상세정보");

  const [isLiked, setIsLiked] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddToPortfolio = () => {
    alert(`${stockData.hts_kor_isnm} 추가 완료!`);
  };

  const handleTimeRangeChange = (option: string) => {
    setSelectedTimeRange(option);
  };

  const handleInfoTypeChange = (option: string) => {
    setSelectedInfoType(option);
  };

  const handleHeartClick = () => {
    setIsLiked((prevLiked) => !prevLiked);
  };

  if (!stockData) {
    return <div>로딩중...</div>;
  }

  const selectedData =
    selectedTimeRange === "7일"
      ? stockData.weeklyPrices
      : stockData.monthlyPrices;

  const chartData = selectedData.map((price, index) => ({
    name: `Day ${index + 1}`,
    value: price,
  }));

  const minPrice = Math.min(...stockData.weeklyPrices);
  const maxPrice = Math.max(...stockData.weeklyPrices);

  const padding = (maxPrice - minPrice) * 0.1;
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;

  return (
    <div className="min-h-screen w-full flex flex-col bg-customDarkGreen">
      <div className="flex justify-between items-center p-4 w-screen">
        <div onClick={handleBackClick} className="text-white">
          <FaArrowLeft size={24} />
        </div>
        <h1 className="text-xl font-bold text-center text-white">
          {stockData.hts_kor_isnm}
        </h1>
        <div className="text-white" onClick={handleHeartClick}>
          {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
        </div>
      </div>

      {/* 주식 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold text-white text-left ml-4">
              {stockData.stck_prpr.toLocaleString()}
            </h1>
            <span
              className={`ml-8 mt-2 text-sm font-normal px-2 py-1 rounded-full ${
                stockData.prdy_ctrt.startsWith("+")
                  ? "bg-green-900 text-white"
                  : "bg-green-100 text-black"
              }`}
            >
              {stockData.prdy_ctrt}
            </span>
          </div>

          {/* 포트폴리오 추가 버튼 */}
          <div
            className="text-white font-bold py-2 px-4 rounded-lg mr-4"
            onClick={handleAddToPortfolio}
          >
            +
          </div>
        </div>
      </div>

      <div className="relative flex justify-center mt-6 mb-4 w-fit bg-green-100 rounded-full mx-auto">
        {["7일", "1개월", "3개월", "1년"].map((option) => (
          <button
            key={option}
            onClick={() => handleTimeRangeChange(option)}
            className={`px-6 py-2 rounded-full focus:outline-none transition-colors ${
              selectedTimeRange === option
                ? "bg-customDarkGreen text-white font-extrabold"
                : "bg-transparent text-gray-700 font-extrabold"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 그래프 */}
      <div className="w-fit mx-auto">
        <div className="w-[350px] h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#32CD32" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#32CD32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={[adjustedMin, adjustedMax]} hide />
              <XAxis dataKey="name" hide />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  border: "none",
                }}
                labelStyle={{ color: "#333" }}
                itemStyle={{ color: "#333" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#32CD32"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 상세정보, 뉴스 선택 바 */}
      <div className="relative flex justify-center mt-6 mb-4 w-fit bg-green-100 rounded-full mx-auto">
        {["상세정보", "뉴스"].map((option) => (
          <button
            key={option}
            onClick={() => handleInfoTypeChange(option)}
            className={`px-6 py-2 rounded-full focus:outline-none transition-colors ${
              selectedInfoType === option
                ? "bg-customDarkGreen text-white font-extrabold"
                : "bg-transparent text-gray-700 font-extrabold"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 카드 */}
      <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md">
        {selectedInfoType === "상세정보" ? (
          <div>
            {[
              { label: "전일", value: stockData.stck_prdy_clpr },
              { label: "시가", value: stockData.stck_oprc },
              { label: "고가", value: stockData.stck_hgpr },
              { label: "저가", value: stockData.stck_lwpr },
              { label: "거래량", value: stockData.acml_vol },
              { label: "52주 최고", value: stockData.stck_mxpr },
              { label: "52주 최저", value: stockData.stck_llam },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between font-extrabold text-gray-700 mb-2 border-b border-gray-300 pb-2"
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* 뉴스 정보 */}
            <p className="text-gray-700">관련 뉴스 없음.</p>
          </div>
        )}
      </div>

      {/* 매수, 매도 버튼 */}
      <div className="mt-6 flex justify-between w-11/12 mx-auto">
        <button className="w-1/2 bg-green-400 text-white py-2 rounded-lg mr-2">
          매수
        </button>
        <button className="w-1/2 bg-red-400 text-white py-2 rounded-lg ml-2">
          매도
        </button>
      </div>
    </div>
  );
};

export default StockDetailPage;
