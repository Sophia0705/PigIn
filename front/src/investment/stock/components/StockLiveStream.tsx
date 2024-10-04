import React, { useEffect, useState } from 'react';

interface Stock {
  stockCode: string;
  close: number;
  date: string;
  time: string;
}

const StockLiveStream: React.FC = () => {
  const [stockData, setStockData] = useState<Stock[]>([]); // Define state type as Stock[]

  useEffect(() => {
    const eventSource = new EventSource(
      'https://j11c203.p.ssafy.io/api/stock/live'
    );

    // Listen for incoming messages
    eventSource.onmessage = (event: MessageEvent) => {
      const data: Stock[] = JSON.parse(event.data); // Expecting an array of Stock objects
      console.log('Received SSE data:', data);
      setStockData((prevData) => [...prevData, ...data]); // Update the state with new data
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close(); // Close the connection on error
    };

    // Clean up the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Live Stock Updates</h2>
      <ul>
        {stockData.map((stock, index) => (
          <li key={index}>
            {stock.stockCode}: {stock.close} - {stock.date} {stock.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockLiveStream;
