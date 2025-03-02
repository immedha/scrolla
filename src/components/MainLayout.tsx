import { FC, ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="min-h-screen p-4 bg-[url(background.png)]">
      <Header />
      <main className="pb-16"> {/* Add padding bottom to account for navigation */}
      {children}
      </main>
      {isLoggedIn && <Navigation />}
    </div>
  );
};

export default MainLayout; 