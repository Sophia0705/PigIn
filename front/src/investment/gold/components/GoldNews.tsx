import React, { useState, useEffect } from 'react';
import { getGoldNews } from '../../../api/investment/gold/GoldNews';
import { GoldNews as GoldNewsType } from '../../interfaces/GoldInterface';

const GoldNews: React.FC<GoldNewsType> = () => {
  const [newsData, setNewsData] = useState<GoldNewsType[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getGoldNews();
        setNewsData(data);
      } catch (error) {
        console.error('스 가져오는 중 에러 발생:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      {newsData.length === 0 ? (
        <p>뉴스 없음</p>
      ) : (
        newsData.map((news, index) => {
          const formattedDate = news.Date.slice(5);
          return (
            <div key={index} className="border-b pt-1 pb-2 border-gray-300">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 flex-1 text-left">
                  {formattedDate}
                </p>
                <h3 className="font-bold text-black flex-1 text-right">
                  <a href={news.Link} target="_blank" rel="noopener noreferrer">
                    {news.NewsTitle}
                  </a>
                </h3>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GoldNews;
