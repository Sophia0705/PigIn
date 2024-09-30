import React, { useState, useEffect } from 'react';
import { getStockNews } from '../../../api/investment/stock/StockNews';
import { StockNews as StockNewsType } from '../../interfaces/StockInterface';

interface StockNewsProps {
  stockId: string;
}

const StockNews: React.FC<StockNewsProps> = ({ stockId }) => {
  const [newsData, setNewsData] = useState<StockNewsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getStockNews(stockId);
        setNewsData(data);
        setLoading(false);
      } catch (error) {
        console.error('뉴스 가져오는 중 에러 발생:', error);
        setError('뉴스 정보 가져오기 실패');
        setLoading(false);
      }
    };

    fetchNews();
  }, [stockId]); // stockId 변경되면 발동

  if (loading) {
    return <p>Loading news...</p>; // 로딩 메시지
  }

  if (error) {
    return <p>{error}</p>; // 에러 메시지
  }

  return (
    <div className="w-10/12 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md h-80 overflow-y-auto">
      {newsData.length === 0 ? (
        <p>뉴스 없음</p>
      ) : (
        newsData.map((news, index) => {
          const formattedDate = news.Date.slice(6, 11);
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

export default StockNews;
