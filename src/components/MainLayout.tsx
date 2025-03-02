import { FC, ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-[url(background.png)]">
      <Header isLoggedIn={isLoggedIn}/>
      <main className="pb-16 px-4 md:px-6 lg:px-8"> 
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
      {isLoggedIn && <Navigation />}
    </div>
  );
};

export default MainLayout; 