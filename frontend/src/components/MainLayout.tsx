import { FC, ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[url(background.png)] bg-cover bg-center overflow-hidden">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
      {isLoggedIn && <Navigation />}
    </div>
  );
};

export default MainLayout;
