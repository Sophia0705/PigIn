import React from "react";

const CryptoNews: React.FC = () => {
  const newsData = [
    {
      title: "뉴스 1",
      date: "09-12",
    },
    {
      title: "뉴스 2",
      date: "09-10",
    },
    {
      title: "뉴스 3",
      date: "09-08",
    },
    {
      title: "뉴스 4",
      date: "09-06",
    },
    {
      title: "뉴스 5",
      date: "09-04",
    },
  ];

  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      {newsData.map((news, index) => (
        <div key={index} className="border-b pt-1 pb-2 border-gray-300">
          <div className="flex justify-between items-center ">
            <p className="text-sm text-gray-600 flex-1 text-left">
              {news.date}
            </p>
            <h3 className="font-bold text-black flex-1 text-right">
              {news.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoNews;
