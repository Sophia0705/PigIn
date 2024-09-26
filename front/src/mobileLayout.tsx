import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [dimensions, setDimensions] = useState({ width: '0px', height: '0px' });

  useEffect(() => {
    const updateDimensions = () => {
      const ratio = 412 / 915;
      const windowHeight = window.innerHeight;
      const calculatedWidth = windowHeight * ratio;
      const limitedWidth = Math.min(calculatedWidth, window.innerWidth);
      setDimensions({
        width: `${limitedWidth}px`,
        height: `${windowHeight}px`,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    document.body.style.overflow = 'hidden';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.backgroundColor = 'white';

    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.body.style.overflow = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        overflow: 'hidden',
        position: 'relative',
      }}
      className="bg-[#1f3f42] shadow-lg"
    >
      <div style={{ height: '100%', overflowY: 'auto' }}>{children}</div>
    </div>
  );
};

export default Layout;
