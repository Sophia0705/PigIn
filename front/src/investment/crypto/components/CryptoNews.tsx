import React, { useState, useEffect } from 'react';
import { getCryptoNews } from '../../../api/investment/crypto/CryptoNews';
import { CryptoNews as CryptoNewsType } from '../../interfaces/CryptoInterface';

const CryptoNews: React.FC<CryptoNewsType> = () => {
  const [newsData, setNewsData] = useState<CryptoNewsType[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getCryptoNews();
        setNewsData(data);
      } catch (error) {
        console.error('뉴스 가져오는 중 에러 발생:', error);
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
          const formattedDate = news.Date.slice(5, 11);
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

export default CryptoNews;
