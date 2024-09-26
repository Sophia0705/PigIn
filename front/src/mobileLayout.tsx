import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const updateWidth = () => {
      // 412:915 비율 유지
      const ratio = 412 / 915;
      const calculatedWidth = window.innerHeight * ratio;
      document.documentElement.style.setProperty(
        '--app-width',
        `${calculatedWidth}px`
      );
    };

    // 초기 설정
    updateWidth();

    // resize 이벤트 리스너 추가
    window.addEventListener('resize', updateWidth);

    document.body.classList.add(
      'm-0',
      'p-0',
      'bg-white',
      'flex',
      'justify-center',
      'min-h-screen'
    );

    return () => {
      window.removeEventListener('resize', updateWidth);
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
    <div className="bg-[#1f3f42] min-h-screen shadow-lg overflow-y-auto app-container">
      {children}
    </div>
  );
};

export default Layout;
