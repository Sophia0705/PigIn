import { useState } from 'react';
import Dashboard from './components/Dashboard';
import PortfolioDetails from './components/PortfolioDetails';
import Navbar from '../components/Navbar';

const COLORS = ['#BBF5E2', '#6183EE', '#ECCD4A']; // 이건 투자 메인의 투자 아이템 색상대로(순서대로 주식, 가상화폐, 금)

interface PortfolioItem {
  name: string;
  value: number;
  quantity: number;
  price: number;
}

interface PortfolioData {
  name: string;
  value: number;
  items: PortfolioItem[];
}

// 임의로 넣은 데이터 --> 여기서 계산해야 맞는건지 나중에 check!
const data: PortfolioData[] = [
  {
    name: '주식',
    value: 9060,
    items: [
      { name: '삼성전자', value: 3020, quantity: 0.05, price: 60400 },
      { name: 'SK하이닉스', value: 3020, quantity: 0.03, price: 100667 },
      { name: 'NAVER', value: 3020, quantity: 0.015, price: 201333 },
    ],
  },
  {
    name: '가상화폐',
    value: 3020,
    items: [
      { name: '비트코인', value: 1510, quantity: 0.00005, price: 30200000 },
      { name: '이더리움', value: 1510, quantity: 0.0005, price: 3020000 },
    ],
  },
  {
    name: '금',
    value: 3020,
    items: [{ name: '금', value: 3020, quantity: 0.02778288, price: 108700 }],
  },
];

const MyPortfolio: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  return (
    <div>
      <div className="bg-white">
        <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
        <Dashboard
          data={data}
          colors={COLORS}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
        {activeIndex !== undefined && (
          <PortfolioDetails
            category={data[activeIndex].name}
            items={data[activeIndex].items}
          />
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default MyPortfolio;
