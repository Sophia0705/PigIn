import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [maxWidth, setMaxWidth] = useState('45.0273vh');

  useEffect(() => {
    const updateMaxWidth = () => {
      // 412:915 비율 유지
      const ratio = 412 / 915;
      const calculatedWidth = window.innerHeight * ratio;
      setMaxWidth(`${calculatedWidth}px`);
    };

    // 초기 설정
    updateMaxWidth();

    // resize 이벤트 리스너 추가
    window.addEventListener('resize', updateMaxWidth);

    document.body.classList.add(
      'm-0',
      'p-0',
      'bg-white',
      'flex',
      'justify-center',
      'min-h-screen'
    );

    return () => {
      window.removeEventListener('resize', updateMaxWidth);
      document.body.classList.remove(
        'm-0',
        'p-0',
        'bg-white',
        'flex',
        'justify-center',
        'min-h-screen'
      );
    };
  }, []);

  return (
    <div
      className="w-full bg-[#1f3f42] min-h-screen shadow-lg overflow-y-auto"
      style={{ maxWidth: maxWidth }}
    >
      {children}
    </div>
  );
};

export default Layout;
