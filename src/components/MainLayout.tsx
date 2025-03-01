import { FC, ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-16"> {/* Add padding bottom to account for navigation */}
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default MainLayout; 