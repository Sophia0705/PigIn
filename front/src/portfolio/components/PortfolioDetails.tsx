interface PortfolioItem {
  name: string;
  value: number;
  quantity: number;
  price: number;
}

interface PortfolioDetailsProps {
  category: string;
  items: PortfolioItem[];
}

const PortfolioDetails: React.FC<PortfolioDetailsProps> = ({
  category,
  items,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{category} 상세 내역</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">종목</th>
            <th className="text-right py-2">수량</th>
            <th className="text-right py-2">평가금액</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">{item.quantity.toFixed(8)}</td>
              <td className="text-right py-2">
                {item.value.toLocaleString()}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioDetails;
