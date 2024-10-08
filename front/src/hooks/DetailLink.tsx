import { Link } from 'react-router-dom';
import { useCryptoData } from './useCryptoData';
import { useStockData } from './useStockData';

interface DetailLinkProps {
  type: 'stock' | 'crypto' | 'gold';
  itemId?: string;
  children: React.ReactNode;
  className?: string;
}

const DetailLink: React.FC<DetailLinkProps> = ({
  type,
  itemId,
  children,
  className,
}) => {
  const cryptoData = useCryptoData();
  const stockData = useStockData();

  const getItemData = () => {
    switch (type) {
      case 'stock':
        return stockData.find((item) => item.stck_shrn_iscd === itemId);
      case 'crypto':
        return cryptoData.find((item) => item.coin === itemId);
      case 'gold':
        return {}; // 금에 대한 데이터 처리는 별도로 필요 없음
      default:
        return null;
    }
  };

  const item = getItemData();

  if (!item && type !== 'gold') {
    return <span className={className}>{children}</span>;
  }

  const to =
    type === 'gold' ? '/investment/gold' : `/investment/${type}/${itemId}`;

  return (
    <Link to={to} state={{ item }} className={className}>
      {children}
    </Link>
  );
};

export default DetailLink;
